import jwt from "jsonwebtoken";

/**
 * Access and refresh tokens are signed with separate secrets so a leaked/
 * misconfigured access-token secret can't be used to mint refresh tokens.
 * Each payload also carries a `type` claim as a second line of defense —
 * if the two secrets were ever accidentally set to the same value, a
 * refresh token still can't be used where an access token is expected.
 */

export const generateAccessToken = (id, role) =>
  jwt.sign({ id, role, type: "access" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });

export const generateRefreshToken = (id) =>
  jwt.sign(
    { id, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d" }
  );

// Kept as default export so any existing `import generateToken from ...`
// call site that only needs an access token doesn't silently break.
export default generateAccessToken;