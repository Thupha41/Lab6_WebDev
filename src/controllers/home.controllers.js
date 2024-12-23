export const getLoginPage = (req, res) => {
  return res.send(
    `<h1>Welcome</h1><a href="/auth/github">Login with Github</a>`
  );
};

export const handleGitHubAuthCallback = (req, res) => {
  return res.redirect("/profile");
};

export const getProfilePage = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.send(
    `<h1>Profile</h1><pre>${JSON.stringify(req.user, null, 2)}</pre>`
  );
};
