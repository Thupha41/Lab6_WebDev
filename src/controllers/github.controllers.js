const GithubStrategy = require("passport-github2").Strategy;
import passport from "passport";
import { envConfig } from "../configs/config.env";
const configLoginWithGithub = () => {
  passport.use(
    new GithubStrategy(
      {
        clientID: envConfig.githubId,
        clientSecret: envConfig.githubSecret,
        callbackURL: envConfig.githubCallbackURL,
      },
      async function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
      }
    )
  );
};
export default configLoginWithGithub;
