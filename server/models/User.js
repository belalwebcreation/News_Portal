import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/* ==========================================
   Position Schema
========================================== */

const positionSchema = new mongoose.Schema(
  {
    x: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },

    y: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================
   Cloudinary Image Schema
========================================== */

const imageSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      default: "",
    },

    url: {
      type: String,
      default: "",
    },

    position: {
      type: positionSchema,
      default: () => ({
        x: 50,
        y: 50,
      }),
    },
  },
  {
    _id: false,
  }
);

/* ==========================================
   Social Links Schema
========================================== */

const socialLinksSchema = new mongoose.Schema(
  {
    facebook: {
      type: String,
      default: "",
      trim: true,
    },

    twitter: {
      type: String,
      default: "",
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    github: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================
   User Schema
========================================== */

const userSchema = new mongoose.Schema(
  {
    // ===============================
    // Basic Information
    // ===============================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [
        /^[a-z0-9_]+$/,
        "Username can only contain letters, numbers and underscore",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email",
      ],
    },

   password: {
  type: String,
  required: [
    function () {
      return this.provider === "local";
    },
    "Password is required",
  ],
  minlength: [6, "Password must be at least 6 characters"],
  select: false,
},

    role: {
  type: String,
  enum: ["reader", "writer", "admin", "superadmin"],
  default: "reader",
},


provider: {
  type: String,
  enum: ["local", "google", "facebook"],
  default: "local",
},

// NOTE: no `default: null` here on purpose. With a sparse+unique index,
// Mongoose would otherwise write an explicit `null` into every document
// that doesn't have this field (local/facebook-only users), and MongoDB's
// sparse index still counts an explicit null as "present" — so the 2nd
// such user would crash on save with an E11000 duplicate key error.
// Leaving it unset (undefined) means the field is simply omitted from
// documents that don't have it, which is what sparse actually needs.
googleId: {
  type: String,
  unique: true,
  sparse: true, // null values duplicate consider hobe na
},

facebookId: {
  type: String,
  unique: true,
  sparse: true, // same reasoning as googleId above
},

    // ===============================
    // Permissions & Security
    // ===============================

    permissions: {
      type: [String],
      default: [],
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    // ===============================
    // Profile
    // ===============================

    avatar: {
      type: imageSchema,
      default: () => ({}),
    },

    coverPhoto: {
      type: imageSchema,
      default: () => ({}),
    },

    profileImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      default: null,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 20,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    occupation: {
      type: String,
      default: "",
      trim: true,
    },

    college: {
  type: String,
  default: "",
  trim: true,
  maxlength: 150,
},

    website: {
      type: String,
      default: "",
      trim: true,
      match: [
        /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/,
        "Please provide a valid website URL",
      ],
    },

    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },

    // ===============================
    // Notification Settings
    // ===============================

    notificationSettings: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
      mention: {
        type: Boolean,
        default: true,
      },
      comment: {
        type: Boolean,
        default: true,
      },
    },

    // ===============================
    // Activity & Analytics Tracking
    // ===============================

    stats: {
      postsCount: {
        type: Number,
        default: 0,
      },
      commentsCount: {
        type: Number,
        default: 0,
      },
      followersCount: {
        type: Number,
        default: 0,
      },
      followingCount: {
        type: Number,
        default: 0,
      },
      // 🟢 নতুন ফিল্ড যোগ করা হলো
      totalViews: {
        type: Number,
        default: 0,
      },
    },

    // ===============================
    // Account Status
    // ===============================

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    // ===============================
    // Password Reset
    // ===============================

    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    // ===============================
    // Email Verification
    // ===============================

    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* ==========================================
   Performance Indexes
========================================== */

userSchema.index({ name: 1 });

userSchema.index({
  role: 1,
  isActive: 1,
  createdAt: -1,
});

/* ==========================================
   Hash Password Before Save
========================================== */

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

/* ==========================================
   Compare Password Method
========================================== */

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;

  return await bcrypt.compare(enteredPassword, this.password);
};

/* ==========================================
   Account Lockout
========================================== */

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.methods.incLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.loginAttempts = 1;
    this.lockUntil = null;
    return this.save({ validateModifiedOnly: true });
  }

  this.loginAttempts += 1;

  if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    this.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
  }

  return this.save({ validateModifiedOnly: true });
};

userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = null;
  return this.save({ validateModifiedOnly: true });
};

/* ==========================================
   Token Helpers
========================================== */

userSchema.methods.createVerificationToken = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  return rawToken;
};

userSchema.methods.createPasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 min
  return rawToken;
};

/* ==========================================
   toJSON / toObject Transform
========================================== */

const hideSensitiveFields = function (doc, ret) {
  delete ret.password;
  delete ret.refreshToken;
  delete ret.passwordResetToken;
  delete ret.passwordResetExpires;
  delete ret.emailVerificationToken;
  delete ret.emailVerificationExpires;
  delete ret.__v;
  return ret;
};

userSchema.set("toJSON", {
  virtuals: true,
  transform: hideSensitiveFields,
});

userSchema.set("toObject", {
  virtuals: true,
  transform: hideSensitiveFields,
});

const User = mongoose.model("User", userSchema);

export default User;
