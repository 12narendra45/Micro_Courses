const rateLimit = require("express-rate-limit");
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 500, 
  keyGenerator: (req) => req.user?.id || req.ip,
  handler: (req, res) => {
    res.status(429).json({ error: { code: "RATE_LIMIT" } });
  },
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: { code: "TOO_MANY_ATTEMPTS", message: "Too many login/register attempts, please try again later." } },
});


const txLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 500,
  message: { error: { code: "TOO_MANY_REQUESTS", message: "Too many creator requests, please try again later." } },
});


const analyticsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 500,
  message: { error: { code: "TOO_MANY_REQUESTS", message: "Too many admin requests, please try again later." } },
});

module.exports = {
  globalLimiter,
  authLimiter,
  txLimiter,
  analyticsLimiter,
};