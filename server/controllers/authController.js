import asyncHandler from "express-async-handler";
import validator from "validator";
import crypto from "crypto";

import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/**
 * Production hardening applied in this file vs the original:
 * 1. Public registration can no longer self-assign "writer"/"editor" role
 *    (was a privilege-escalation bug — anyone could POST role:"writer").
 * 2. Email-verification & password-reset tokens are now hashed (sha256)
 *    before being stored — the raw token only ever exists in the email link,
 *    same pattern as password hashing. A leaked DB no longer means leaked tokens.
 * 3. forgotPassword no longer returns the reset token in the API response
 *    (that was a full account-takeover hole — anyone could reset any account
 *    just by knowing the email, no inbox access needed). It now emails the
 *    link, like registration does.
 * 4. forgotPassword / resendVerificationEmail always return the same generic
 *    message whether or not the email exists, to avoid leaking which emails
 *    are registered (user enumeration).
 * 5. verifyEmail is now idempotent: it checks `isVerified` instead of
 *    deleting the token as its "already used" signal. This is the actual
 *    fix for your bug — DB showed isVerified:true but the page said
 *    "failed" because the token got wiped by a first (successful) call,
 *    then a second call (React StrictMode double-invoke, double click, or
 *    an email-security scanner pre-visiting the link) couldn't find the
 *    user anymore and returned "invalid token". Now a repeat call on an
 *    already-verified account just returns success again.
 * 6. registerUser no longer hands out a working JWT before the account is
 *    verified — loginUser already blocks unverified accounts, so issuing
 *    a login token at signup was inconsistent. See note below if you want
 *    auto-login-after-signup back.
 * 7. Added resendVerificationEmail — needed once #5 exists, since a user
 *    whose link genuinely expired needs a way to get a new one. Remember
 *    to wire this into authRoutes.js.
 * 8. Emails are lowercased/trimmed before every lookup so
 *    "User@x.com" and "user@x.com" are treated as the same account.
 */

// Hash a raw token the same way before storing/comparing it.
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// ===========================
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
// ===========================
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // role is intentionally NOT read from req.body — see file header note #1.
  // Promoting a reader to writer/editor/admin must go through a
  // separate admin-only endpoint, never public self-registration.

  if (!name || !email || !password) {
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
    email: normalizedEmail,
    password,
    role: "reader",
    emailVerificationToken: hashToken(rawVerificationToken),
    emailVerificationExpires,
  });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawVerificationToken}`;

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
    // The account is already created — don't strand it in a state where
    // the user can neither log in (unverified) nor get a link (email failed)
    // nor register again (email taken). Clear the token so resendVerificationEmail
    // can issue a fresh one later.
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.status(201).json({
      success: true,
      message:
        "Account created, but the verification email could not be sent. Please request a new verification link.",
    });
  }

  // No JWT is issued here on purpose — the account isn't verified yet and
  // loginUser rejects unverified accounts anyway. If you want auto-login
  // immediately after signup (skippable verification), issue
  // generateToken(user._id, user.role) here and return it — but then also
  // relax the isVerified check in loginUser to match, otherwise the token
  // you hand out won't actually work for anything.
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

  // Idempotent guard — a repeat call with the same link (double click,
  // React effect firing twice, an email scanner pre-visiting the link)
  // lands here and gets a success response instead of a false failure.
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

  // Same response whether the account doesn't exist or is already
  // verified — don't leak which emails are registered.
  if (!user || user.isVerified) {
    return res.status(200).json(genericResponse);
  }

  const rawVerificationToken = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = hashToken(rawVerificationToken);
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawVerificationToken}`;

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

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
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
  const { name, phone, address, bio, avatar } = req.body;
  // email, password and role are deliberately not editable here —
  // email changes need re-verification, password has its own endpoint,
  // and role must never be settable by the user themselves.

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  if (name !== undefined) user.name = name.trim();
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
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

  // ===========================
// Email Verified Check
// ===========================

if (!user.isVerified) {
  return res.status(403).json({
    success: false,
    message: "Please verify your email first.",
  });
}

// ===========================
// Account Active Check
// ===========================

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

  user.password = newPassword; // pre("save") hook hashes it
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
  // JWT is stateless and stored client-side (Authorization header), so
  // there's nothing to invalidate server-side here — this endpoint exists
  // for a consistent API surface. The client is responsible for discarding
  // the token. If you later move to httpOnly cookies, clear the cookie here.
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

  // Same response whether or not the account exists — don't leak which
  // emails are registered (user enumeration).
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

  user.password = password; // pre("save") hook hashes it
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully. You can now log in.",
  });
});
