import express from "express";
import initApiRoute from "./routes/api";
import defaultErrorHandler from "./middlewares/errors.middlewares";
import configSession from "./configs/config.session";
import { envConfig } from "./configs/config.env";
import configLoginWithGithub from "./controllers/github.controllers";
import webRoutes from "./routes/web";
import mongoDatabaseService from "./databases/init.mongodb";
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

//Connect to database mongo db
mongoDatabaseService.connect();

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
