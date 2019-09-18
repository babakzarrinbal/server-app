var emitter = require("events").EventEmitter;
const eventemitter = new emitter();
var { objectSort } = require("object-projection");
var exp = {
  redis: null
};
var redis = require("redis");
// var sub = redis.createClient();
// var pub = redis.createClient();
var client = redis.createClient();

// client.on("connect", function() {
//   console.log("Redis client connected");
// });
// client.on("error", function(err) {
//   console.log("Something went wrong " + err);
// });
// client.set("my test key", "my test value", redis.print);
// client.get("my test key", function(error, result) {
//   console.log("GET result ->" + result);
// });

// sub.subscribe("bahar", console.log);
// // sub.subscribe("ali", console.log);
// sub.on("message", console.log);
// pub.publish("bahar", "test21");
// pub.publish("ali", "test2");
// client.LPUSH("babak", "teststring1");
// client.LPUSH("babak", "teststring2");
// client.LPUSH("babak", "teststring3");
// client.LPUSH("babak", "teststring4");
// client.LPUSH("babak", "teststring5");
// // client.BRPOP()
// client.RPOP("babak", console.log);
// client.RPOP("babak", console.log);
// client.RPOP("babak", console.log);
// client.RPOP("babak", console.log);
// client.RPOP("babak", console.log);
// simple queue locally

var queue = {};
exp.jobreq = (event, data) =>
  new Promise(async resolve => {
    if (!queue[event]) queue[event] = { queue: [], proccessing: [] };
    let dataid =
      typeof data == "object"
        ? JSON.stringify(objectSort(data))
        : data.toString();
    eventemitter.once(event + "_result_" + dataid, resolve);
    if (
      queue[event].proccessing.includes(dataid) ||
      queue[event].queue.includes(dataid)
    )
      return;
    queue[event].queue.push(dataid);
    eventemitter.emit(event);
  });

exp.addworker = (event, worker) => {
  eventemitter.on(event, async () => {
    let result;
    if (!queue[event].queue.length) return;
    let input = queue[event].queue.shift();
    queue[event].proccessing.push(input);
    let parsedinput;
    try {
      parsedinput = JSON.parse(input);
    } catch (e) {
      parsedinput = input;
    }
    try {
      result = { data: await worker(parsedinput), error: null };
    } catch (e) {
      result = { data: null, error: "can't do it" };
    }
    queue[event].proccessing = queue[event].proccessing.filter(e => e != input);
    eventemitter.emit(event + "_result_" + input, result);
    eventemitter.emit(event);
  });
};

module.exports = exp;
