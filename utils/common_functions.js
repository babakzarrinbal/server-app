
var format = require('dateformat');
Date.prototype.format = function (forma) {
  return format(this, forma);
}

global.delay = async function (delay) { return new Promise(resolve => setTimeout(resolve, delay)) }
global.validstring = sinput => typeof sinput == "string" ? sinput.toLowerCase().replace(/[\W]+/g, "_") : sinput;

var cs = {
  u: "\x1b[4m", //underscore
  ur: "\x1b[31m\x1b[4m", //red
  r: "\x1b[31m", //red
  ug: "\x1b[32m\x1b[4m", //green
  g: "\x1b[32m", //green
  uy: "\x1b[33m\x1b[4m", //yellow
  y: "\x1b[33m", //yellow
  ub: "\x1b[34m\x1b[4m", //blue
  b: "\x1b[34m", //blue
  wb: "\x1b[30m\x1b[47m", //back white front black
};
// var cs = {
//   reset: "\x1b[0m",
//   bright: "\x1b[1m",
//   dim: "\x1b[2m",
//   underscore: "\x1b[4m",
//   u: "\x1b[4m",
//   blink: "\x1b[5m",
//   reverse: "\x1b[7m",
//   hidden: "\x1b[8m",
//   black: "\x1b[30m",
//   red: "\x1b[31m",
//   r: "\x1b[31m",
//   green: "\x1b[32m",
//   g: "\x1b[32m",
//   yellow: "\x1b[33m",
//   y: "\x1b[33m",
//   blue: "\x1b[34m",
//   b: "\x1b[34m",
//   ba: "\x1b[30m\x1b[47m",
//   magenta: "\x1b[35m",
//   cyan: "\x1b[36m",
//   FgWhite: "\x1b[37m",
//   BgBlack: "\x1b[40m",
//   BgRed: "\x1b[41m",
//   BgGreen: "\x1b[42m",
//   BgYellow: "\x1b[43m",
//   BgBlue: "\x1b[44m",
//   BgMagenta: "\x1b[45m",
//   BgCyan: "\x1b[46m",
//   BgWhite: "\x1b[47m",
// };

/**
 * @param {string} color values:[b|r|g|y|ub|ur|ug|uy|wb] description:
 * [b:blue, r:red, g:green, y:yellow, wb:black with white back ,u prefix for:underline ]
 * @param {*=} message console messages
 */
global.blog = function (color, ...message) {
  if (typeof color == 'string' && cs[color] && message) {
    message = message.map(m => typeof m != 'object' ? m : JSON.stringify(m, null, 2));
    console.log(cs[color], ...message, '\x1b[0m')
  } else {
    if (color == 's') {
      message = message.map(m => typeof m != 'object' ? m : JSON.stringify(m, null, 2));
      console.log(...message);
    } else {
      console.log(color, ...message);
    }

  }

};
