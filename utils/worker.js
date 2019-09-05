var emitter = require("events").EventEmitter;
const eventemitter = new emitter();
var { objectSort } = require("object-projection");
var exp = {};

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
