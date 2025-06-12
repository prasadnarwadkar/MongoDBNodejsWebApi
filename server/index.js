// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
require('./config/mongoose');

// Custom CORS middleware
const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');

  if (req.method === 'options' || 
    req.method === 'OPTIONS'
  ) {
    return res.status(200).json({});
  }
  next();
};

// Use the custom middleware
app.use(corsMiddleware);

const api_key = "<api_key_here>"

app.use(function(req, res, next) {
  if (!req.headers["api-key"]) {
    return res.status(401).json({ error: 'Please send valid api-key header with valid API key.' });
  }
  else if (req.headers["api-key"] !== api_key)
  {
    return res.status(401).json({ error: 'API key is invalid.' });
  }
  next();
});

// Hello World for index page
app.get('/', function (req, res) {
  return res.send("Hello World From Auth API!");
})

if (!module.parent) {
  app.listen(process.env.SERVER_PORT || 8080, () => {
    console.info(`server started on port ${process.env.SERVER_PORT || 8080} (${config.env})`);
  });
}

module.exports = app;
