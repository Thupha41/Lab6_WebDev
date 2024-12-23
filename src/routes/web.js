import { Router } from "express";
import {
  getLoginPage,
  handleGitHubAuthCallback,
  getProfilePage,
} from "../controllers/home.controllers";
import passport from "passport";
const router = Router();

router.get("/", getLoginPage);

router.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  handleGitHubAuthCallback
);

router.get("/profile", getProfilePage);

export default router;
