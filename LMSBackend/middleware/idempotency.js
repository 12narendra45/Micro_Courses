
module.exports = (redisClient) => async (req, res, next) => {
  if (req.method === 'POST' && req.headers['idempotency-key']) {
    const key = `idempotency:${req.headers['idempotency-key']}`;
    const exists = await redisClient.get(key);
    if (exists) {
      return res.status(200).json(JSON.parse(exists));
    }
    res.idempotencyKey = key;
  }
  next();
};
