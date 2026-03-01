const jwt = require("jsonwebtoken");
const { AppError } = require("./errorHandler");
const logger = require("../utils/logger");

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided. Please authenticate.", 401);
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      frappeUserId: decoded.frappeUserId,
    };
    // Also set req.userId for backward compatibility
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(
        new AppError("Invalid token. Please authenticate again.", 401),
      );
    }
    if (error.name === "TokenExpiredError") {
      return next(
        new AppError("Token expired. Please authenticate again.", 401),
      );
    }
    next(error);
  }
};

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }

    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
