import { expressjwt } from "express-jwt";
import jwt from 'jsonwebtoken'

export const requireSignin = expressjwt({
  getToken: (req, res) => {
    console.log("GET TOKEN", req.token);
    return req.token;
  },
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

export const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization;

  if (!token) {
    // If no token is provided, return an unauthorized response
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify and decode the token
  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        // If the token is invalid or expired, return an error response
        return res.status(401).json({ message: "Token is not valid" });
      }

      // Token is valid, you can access the decoded data in 'decoded'
      req.user = decoded;
      next();
    }
  );
};
