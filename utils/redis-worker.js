var { objectSort } = require("object-projection");
var exp = {
  redisArgs: []
};
var redis = require("redis");
var jobsub;
var wosub;
var client = redis.createClient();

exp.work = (event, ...data) =>
  new Promise(async resolve => {
    let dataid = JSON.stringify(objectSort(data));
    let resolved;
    if (!jobsub) jobsub = redis.createClient(...exp.redisArgs);
    jobsub.subscribe(event + "_result_" + dataid);
    jobsub.on("message", (ev, d) => {
      resolved = true;
      jobsub.unsubscribe(event + "_result_" + dataid);
      return resolve(d);
    });
    //check processing and and queue list for existance
    let proccessing = new Promise(res =>
      client.LRANGE(event + "::processing", 0, -1, (er, r) => res(r || []))
    );
    let queue = new Promise(res =>
      client.LRANGE(event + "::queue", 0, -1, (er, r) => res(r || []))
    );
    if ([...proccessing, ...queue].includes(dataid) || resolved) return;
    client.LPUSH(event + "::queue", dataid);
    client.publish(event);
  });

var activeworkers = {};
exp.addWorker = (event, worker, thread = 1) => {
  if (!wosub) wosub = redis.createClient(...redisArgs);
  wosub.subscribe(event);

  let listenerfunc = async () => {
    let input = await new Promise(res =>
      client.RPOPLPUSH(event + "::queue", event + "::processing", (er, r) =>
        res(r)
      )
    );
    if (input == null || !activeworkers[event].thread) return;
    activeworkers[event].thread--;
    let parsedinput;
    parsedinput = JSON.parse(input);
    let result;
    try {
      result = { data: await worker(...parsedinput), error: null };
    } catch (e) {
      result = { data: null, error: "can't do it" };
    }
    client.LREM(event + "::processing", 1, input);
    client.publish(event + "_result_" + input, result);
    activeworkers[event].thread++;
    client.publish(event);
  };

  activeworkers[event] = {
    thread,
    worker: listenerfunc
  };
  wosub.on("message", listenerfunc);
};

exp.removeWorker = event => {
  if (!activeworkers[event]) return;
  wosub.removeListener("message", activeworkers[event].worker);
  delete activeworkers[event];
};

module.exports = exp;

// client.LREM("test1", 1, "test2", console.log);
client.LPUSH("test", "test", function() {
  elements = client.LRANGE("supplier_id", 0, -1, console.log);
});
// sub.subscribe("hassan");
// sub.subscribe("ali");
// sub.subscribe("reza");
// var alilistener = (ev, data) => {
//   if (ev == "ali") {
//     console.log("ali second on", data);
//     sub.removeListener("message", alilistener);
//   }
// };
// sub.on("message", console.log);
// sub.on("message", alilistener);

// pub.publish("ali", "test2");
// pub.publish("hassan", "test1");
// pub.publish("reza", "test3");
// pub.publish("ali", "test2");

// var sub = redis.createClient();
// var pub = redis.createClient();

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
