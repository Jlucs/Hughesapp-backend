const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
  windowsMs: 60 * 1000, // 1minute
  max: 5, // Limit each IP to 5 login requests per "window" per minute
  message: {
    message:
      "too many login attempts from this IP, please try again after a 60 second pause",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the "RateLimit-*" headers
  legacyHeaders: false, // Disable the "X-RateLimit-*" headers
});

module.exports = loginLimiter;
