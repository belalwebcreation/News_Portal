import asyncHandler from "express-async-handler";
import validator from "validator";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { setAuthCookies, clearAuthCookies } from "../utils/tokenCookies.js";

// Hash a raw token the same way before storing/comparing it.
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// Normalize an incoming avatar/coverPhoto payload into the
// { public_id, url } shape the schema expects. Accepts:
//   - undefined             -> untouched (caller checks this first)
//   - "" or null            -> cleared back to empty image object
//   - { public_id, url }    -> passed through (missing keys defaulted to "")
//   - anything else         -> rejected as invalid
// Returns { ok: true, value } or { ok: false }.
const normalizeImageField = (input) => {
  if (input === "" || input === null) {
    return { ok: true, value: { public_id: "", url: "" } };
  }

  if (typeof input === "object" && !Array.isArray(input)) {
    return {
      ok: true,
      value: {
        public_id: typeof input.public_id === "string" ? input.public_id : "",
        url: typeof input.url === "string" ? input.url : "",
      },
    };
  }

  return { ok: false };
};

// Turn a Google display name (or email local-part, as fallback) into a
// unique, schema-valid username. The User schema requires lowercase
// [a-z0-9_] only, 3-30 chars — Google names can have spaces/accents/capitals,
// so this slugifies first, then resolves collisions with a numeric suffix.
const generateUniqueUsername = async (seed) => {
  let base = seed
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents, e.g. é -> e
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 20);

  if (!base) base = "user";
  if (base.length < 3) base = `user_${base}`;

  let candidate = base;
  let suffix = 0;

  // Bounded retry — collisions should be rare, but this guarantees
  // termination instead of looping forever on a very common name.
  while (await User.exists({ username: candidate })) {
    suffix += 1;
    candidate = `${base}_${suffix}`;
    if (suffix > 50) {
      candidate = `${base}_${crypto.randomBytes(3).toString("hex")}`;
      break;
    }
  }

  return candidate;
};

// Verifies a Google OAuth access token in two steps:
// 1. tokeninfo — confirms this token was actually issued for THIS app
//    (checks `aud` against our GOOGLE_CLIENT_ID). Skipping this step would
//    let a valid access token from a completely different Google app be
//    replayed against this endpoint.
// 2. userinfo — fetches the actual profile (sub/email/name/picture) once
//    step 1 has confirmed the token is trustworthy for us to use.
const verifyGoogleAccessToken = async (accessToken) => {
  const tokenInfoRes = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
  );

  if (!tokenInfoRes.ok) {
    throw new Error("Could not verify Google access token.");
  }

  const tokenInfo = await tokenInfoRes.json();

  if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Token was not issued for this application.");
  }

  const userInfoRes = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!userInfoRes.ok) {
    throw new Error("Could not fetch Google profile.");
  }

  return userInfoRes.json();
};

// Verifies a Facebook access token in two steps:
// 1. debug_token — confirms this token was actually issued for THIS app
//    (checks `app_id` against our FACEBOOK_APP_ID, and `is_valid`) using an
//    app access token (`{app-id}|{app-secret}`). Skipping this step would
//    let a valid access token from a completely different Facebook app be
//    replayed against this endpoint.
// 2. /me — fetches the actual profile (id/email/name/picture) once step 1
//    has confirmed the token is trustworthy for us to use.
const verifyFacebookAccessToken = async (accessToken) => {
  const appAccessToken = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;

  const debugRes = await fetch(
    `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(
      accessToken
    )}&access_token=${encodeURIComponent(appAccessToken)}`
  );

  if (!debugRes.ok) {
    throw new Error("Could not verify Facebook access token.");
  }

  const debugInfo = await debugRes.json();
  const tokenData = debugInfo?.data;

  if (!tokenData?.is_valid) {
    throw new Error("Facebook access token is invalid or expired.");
  }

  if (tokenData.app_id !== process.env.FACEBOOK_APP_ID) {
    throw new Error("Token was not issued for this application.");
  }

  const profileRes = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(
      accessToken
    )}`
  );

  if (!profileRes.ok) {
    throw new Error("Could not fetch Facebook profile.");
  }

  return profileRes.json();
};

// ===========================
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
// ===========================
export const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!validator.isEmail(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters.",
    });
  }

  const normalizedUsername = username.trim().toLowerCase();

  const existingUsername = await User.findOne({
    username: normalizedUsername,
  });

  if (existingUsername) {
    return res.status(400).json({
      success: false,
      message: "Username already exists.",
    });
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already exists.",
    });
  }

  const rawVerificationToken = crypto.randomBytes(32).toString("hex");
  const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h

  const user = await User.create({
    name: name.trim(),
    username: normalizedUsername,
    email: normalizedEmail,
    password,
    role: "reader",
    emailVerificationToken: hashToken(rawVerificationToken),
    emailVerificationExpires,
  });

const verifyUrl = `${process.env.CLIENT_URL}/news/verify-email/${rawVerificationToken}`;

  const message = `
    <h2>Welcome to News Portal</h2>
    <p>Hello ${user.name},</p>
    <p>Please click the button below to verify your email.</p>
    <a href="${verifyUrl}"
       style="background:#2563eb;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;display:inline-block;">
       Verify Email
    </a>
    <p>This link will expire in 24 hours.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Verify Your Email",
      message,
    });
  } catch (err) {
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.status(201).json({
      success: true,
      message:
        "Account created, but the verification email could not be sent. Please request a new verification link.",
    });
  }

  res.status(201).json({
    success: true,
    message: "Account created. Please check your email to verify your account.",
  });
});

// ===========================
// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
// ===========================
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Verification token is required.",
    });
  }

  const user = await User.findOne({
    emailVerificationToken: hashToken(token),
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid verification link.",
    });
  }

  if (user.isVerified) {
    return res.status(200).json({
      success: true,
      message: "Email already verified. You can log in.",
    });
  }

  if (user.emailVerificationExpires < Date.now()) {
    return res.status(400).json({
      success: false,
      message: "Verification link expired. Please request a new one.",
    });
  }

  user.isVerified = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully. You can now log in.",
  });
});

// ===========================
// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
// ===========================
export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "A valid email is required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  const genericResponse = {
    success: true,
    message:
      "If this email is registered and not yet verified, a new verification link has been sent.",
  };

  if (!user || user.isVerified) {
    return res.status(200).json(genericResponse);
  }

  const rawVerificationToken = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = hashToken(rawVerificationToken);
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

 const verifyUrl = `${process.env.CLIENT_URL}/news/verify-email/${rawVerificationToken}`;

  const message = `
    <h2>Verify your email</h2>
    <p>Hello ${user.name},</p>
    <p>Click the button below to verify your email. This link expires in 24 hours.</p>
    <a href="${verifyUrl}"
       style="background:#2563eb;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;display:inline-block;">
       Verify Email
    </a>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Verify your email",
      message,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Could not send verification email. Please try again later.",
    });
  }

  res.status(200).json(genericResponse);
});

// ===========================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ===========================
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email before logging in.",
    });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.lastLogin = new Date();
  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateModifiedOnly: true });

  setAuthCookies(res, { accessToken, refreshToken });

  res.status(200).json({
    success: true,
    message: "Login successful.",
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      coverPhoto: user.coverPhoto,
    },
  });
});

// ===========================
// @desc    Login or register via Google
// @route   POST /api/auth/google
// @access  Public
// ===========================
export const googleLogin = asyncHandler(async (req, res) => {
  const { accessToken: googleAccessToken } = req.body;

  if (!googleAccessToken) {
    return res.status(400).json({
      success: false,
      message: "Google access token is required.",
    });
  }

  let payload;
  try {
    payload = await verifyGoogleAccessToken(googleAccessToken);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired Google access token.",
    });
  }

  const { sub: googleId, email, email_verified, name, picture } = payload;

  const isEmailVerified = email_verified === true || email_verified === "true";

  if (!email || !isEmailVerified) {
    return res.status(401).json({
      success: false,
      message: "Google account email is not verified.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  let user = await User.findOne({ googleId });

  if (!user) {
    user = await User.findOne({ email: normalizedEmail });

    if (user) {
      user.googleId = googleId;
      if (!user.isVerified) user.isVerified = true;
      if (!user.avatar?.url && picture) {
        user.avatar = { public_id: "", url: picture };
      }
    } else {
      const username = await generateUniqueUsername(name || normalizedEmail);

      user = new User({
        name: name?.trim() || normalizedEmail.split("@")[0],
        username,
        email: normalizedEmail,
        provider: "google",
        googleId,
        isVerified: true,
        avatar: picture ? { public_id: "", url: picture } : undefined,
      });
    }
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: "Your account has been disabled. Please contact the administrator.",
    });
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.lastLogin = new Date();
  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateModifiedOnly: true });

  setAuthCookies(res, { accessToken, refreshToken });

  res.status(200).json({
    success: true,
    message: "Login successful.",
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      coverPhoto: user.coverPhoto,
    },
  });
});

// ===========================
// @desc    Login or register via Facebook
// @route   POST /api/auth/facebook
// @access  Public
// ===========================
export const facebookLogin = asyncHandler(async (req, res) => {
  const { accessToken: facebookAccessToken } = req.body;

  if (!facebookAccessToken) {
    return res.status(400).json({
      success: false,
      message: "Facebook access token is required.",
    });
  }

  let payload;
  try {
    payload = await verifyFacebookAccessToken(facebookAccessToken);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired Facebook access token.",
    });
  }

  const { id: facebookId, email, name, picture } = payload;
  const pictureUrl = picture?.data?.url;

  // Facebook has no email_verified flag like Google's — Facebook itself
  // verifies emails at signup, so any email it returns is treated as
  // trusted. Some Facebook accounts (e.g. phone-number-only signups) have
  // no email at all, so that case is rejected explicitly rather than
  // silently falling back to something else.
  if (!email) {
    return res.status(401).json({
      success: false,
      message: "Facebook account has no email associated with it.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  let user = await User.findOne({ facebookId });

  if (!user) {
    user = await User.findOne({ email: normalizedEmail });

    if (user) {
      user.facebookId = facebookId;
      if (!user.isVerified) user.isVerified = true;
      if (!user.avatar?.url && pictureUrl) {
        user.avatar = { public_id: "", url: pictureUrl };
      }
    } else {
      const username = await generateUniqueUsername(name || normalizedEmail);

      user = new User({
        name: name?.trim() || normalizedEmail.split("@")[0],
        username,
        email: normalizedEmail,
        provider: "facebook",
        facebookId,
        isVerified: true,
        avatar: pictureUrl ? { public_id: "", url: pictureUrl } : undefined,
      });
    }
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: "Your account has been disabled. Please contact the administrator.",
    });
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.lastLogin = new Date();
  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateModifiedOnly: true });

  setAuthCookies(res, { accessToken, refreshToken });

  res.status(200).json({
    success: true,
    message: "Login successful.",
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      coverPhoto: user.coverPhoto,
    },
  });
});

// ===========================
// @desc    Issue a new access token using the refresh token cookie
// @route   POST /api/auth/refresh
// @access  Public (no access token required — relies on refreshToken cookie)
// ===========================
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token missing. Please log in again.",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    clearAuthCookies(res);
    return res.status(401).json({
      success: false,
      message: "Refresh token invalid or expired. Please log in again.",
    });
  }

  if (decoded.type !== "refresh") {
    clearAuthCookies(res);
    return res.status(401).json({
      success: false,
      message: "Invalid token type.",
    });
  }

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || !user.refreshToken) {
    clearAuthCookies(res);
    return res.status(401).json({
      success: false,
      message: "Session not recognized. Please log in again.",
    });
  }

  const isSameToken = user.refreshToken === hashToken(incomingRefreshToken);

  if (!isSameToken) {
    user.refreshToken = null;
    await user.save({ validateModifiedOnly: true });
    clearAuthCookies(res);

    return res.status(401).json({
      success: false,
      message: "Session invalid. Please log in again.",
    });
  }

  if (!user.isActive) {
    clearAuthCookies(res);
    return res.status(403).json({
      success: false,
      message: "Your account has been disabled.",
    });
  }

  const newAccessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = hashToken(newRefreshToken);
  await user.save({ validateModifiedOnly: true });

  setAuthCookies(res, {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });

  res.status(200).json({
    success: true,
    message: "Token refreshed.",
  });
});

// ===========================
// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
// ===========================
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// ===========================
// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
// ===========================
export const updateProfile = asyncHandler(async (req, res) => {
  const {
    name,
    username,
    phone,
    address,
    bio,
    avatar,
    coverPhoto,
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  if (name !== undefined) user.name = name.trim();

  if (username !== undefined) {
    const normalizedUsername = username.trim().toLowerCase();
    
    if (normalizedUsername !== user.username) {
      const existingUsername = await User.findOne({
        username: normalizedUsername,
      });

      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already exists.",
        });
      }

      user.username = normalizedUsername;
    }
  }

  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (bio !== undefined) user.bio = bio;

  if (avatar !== undefined) {
    const normalized = normalizeImageField(avatar);
    if (!normalized.ok) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid avatar format. Expected an object like { url, public_id } or an empty value to remove it.",
      });
    }
    user.avatar = normalized.value;
  }

  if (coverPhoto !== undefined) {
    const normalized = normalizeImageField(coverPhoto);
    if (!normalized.ok) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid coverPhoto format. Expected an object like { url, public_id } or an empty value to remove it.",
      });
    }
    user.coverPhoto = normalized.value;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      coverPhoto: updatedUser.coverPhoto,
      phone: updatedUser.phone,
      address: updatedUser.address,
      bio: updatedUser.bio,
    },
  });
});

// ===========================
// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
// ===========================
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required.",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters.",
    });
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect.",
    });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email first.",
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: "Your account has been disabled. Please contact the administrator.",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: "New password must be different.",
    });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
});

// ===========================
// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
// ===========================
export const logoutUser = asyncHandler(async (req, res) => {
  if (req.user) {
    req.user.refreshToken = null;
    await req.user.save({ validateModifiedOnly: true });
  }

  clearAuthCookies(res);

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});

// ===========================
// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
// ===========================
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "A valid email is required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  const genericResponse = {
    success: true,
    message: "If an account exists for this email, a password reset link has been sent.",
  };

  if (!user) {
    return res.status(200).json(genericResponse);
  }

  const rawResetToken = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = hashToken(rawResetToken);
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawResetToken}`;

  const message = `
    <h2>Reset your password</h2>
    <p>Hello ${user.name},</p>
    <p>You requested a password reset. This link expires in 15 minutes.</p>
    <a href="${resetUrl}"
       style="background:#2563eb;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;display:inline-block;">
       Reset Password
    </a>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset your password",
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(500).json({
      success: false,
      message: "Could not send reset email. Please try again later.",
    });
  }

  res.status(200).json(genericResponse);
});

// ===========================
// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
// ===========================
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters.",
    });
  }

  const user = await User.findOne({
    passwordResetToken: hashToken(token),
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired reset link. Please request a new one.",
    });
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully. You can now log in.",
  });
});
