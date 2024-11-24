import passport from "passport";

export const authorize = (options) => {
  const isAdmin = options?.isAdmin || false;
  const isSuperAdmin = options?.isSuperAdmin || false;

  return async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;

      if (isAdmin && !["admin", "superadmin"].includes(user.role)) {
        return res.status(403).json({ message: "Access Denied!" });
      }

      if (isSuperAdmin && user.role !== "superadmin") {
        return res.status(403).json({ message: "Access Denied!" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  };
};

export const authenticate = (req, res, next) =>
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (info?.error || !user) {
      return res.status(401).json({ message: info?.error || "Unauthorized" });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      next();
    });
  })(req, res, next);
