//"use strict";
require("./utils/common_functions.js");

global.worker = require("./utils/worker");

// worker.addworker("testev", function(a) {
//   return a + "result";
// });

// for (let i = 0; i < 10; i++) {
//   worker.jobreq("testev", i).then(console.log);
// }
var app = require("express")(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  appconfig = require("./appconfig");

// enable cors for specefeid in appconfig
if (env.cors) {
  app.use(function(req, res, next) {
    jconf.cors.forEach(a => res.header("Access-Control-Allow-Origin", a));
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
}
app.disable("x-powered-by");
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true })); // Parse application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: "100mb" }));
// app.use(
//     "/app",
//     express.static(path.join(__dirname, "/app"), { maxAge: 7 * 86400000 })
//   );
var server = require("http").createServer(app);

mongoose.connect(...appconfig.mongodb);
mongoose.connection.on("error", error =>
  console.error("Error in MongoDb connection: " + error)
);
mongoose.connection.on("connected", () => console.log("SERVER Started!"));
mongoose.connection.on("reconnected", () =>
  console.log("MongoDB reconnected!")
);
mongoose.connection.on("disconnected", () =>
  console.log("MongoDB disconnected!")
);

try {
  server.listen(appconfig.app.port, appconfig.app.host, function() {
    console.log(
      "Server turned on with",
      appconfig.mode,
      "mode on ",
      appconfig.app.host + ":" + appconfig.app.port
    );
  });
} catch (ex) {
  console.log(ex);
}
