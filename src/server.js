import express from "express";
import initApiRoute from "./routes/api";
import defaultErrorHandler from "./middlewares/errors.middlewares";
import configSession from "./configs/config.session";
import { envConfig } from "./configs/config.env";
import configLoginWithGithub from "./controllers/github.controllers";
import webRoutes from "./routes/web";
const app = express();
const port = envConfig.port;
const hostname = envConfig.host;
//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//express-session config
configSession(app);

//web routes
app.use("/", webRoutes);

// api routes
initApiRoute(app);

//Login with github
configLoginWithGithub();

//default error request handler
app.use(defaultErrorHandler);

app.listen(port, hostname, () => {
  console.log(`App running on http://localhost:${port}`);
});
