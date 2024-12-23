import session from "express-session";
import passport from "passport";
const configSession = (app) => {
  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  //   mã hóa: format thông tin
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // giải mã: đọc thông tin format
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default configSession;
