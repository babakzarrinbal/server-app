var exp = {};
// if (proccess.env) {
// }
exp.mode = "development";
exp.app = {
  host: "localhost",
  port: 3007
};
exp.mongodb = ["127.0.0.1:27017", {}];
module.exports = exp;
