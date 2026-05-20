const logger = (req, res, next) => {
  const method = req.method;
  const path = req.originalUrl;
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  console.log(`[${method}] ${path} - ${timestamp}`);

  next(); // ALWAYS call next() or the request dies here
};

module.exports = logger;