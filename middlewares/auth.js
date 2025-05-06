import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "admin" && user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Error verifying admin status" });
  }
};

export const verifySuperAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. Super Admin privileges required." });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Error verifying super admin status" });
  }
};