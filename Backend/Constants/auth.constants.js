export const cookieOption = {
  httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  secure: false, // Use `false` for local development (HTTP), `true` for production (HTTPS)
  sameSite: "strict", // Required for cross-origin cookies
  maxAge: 24 * 60 * 60 * 1000, // Expiration time in milliseconds (1 day)
};