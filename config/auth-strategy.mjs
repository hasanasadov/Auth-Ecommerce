import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../schemas/user.mjs";
import { comparePassword } from "../utils/bcrypt.mjs";

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id).select(
      "-password -forgotPasswordToken -forgotPasswordTokenExpires"
    );
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { error: "Invalid credentials!" });
        }

        if (!comparePassword(password, user.password)) {
          return done(null, false, { error: "Invalid credentials!" });
        }

        if (user.isBlocked) {
          return done(null, false, { error: "Your account has been blocked" });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
