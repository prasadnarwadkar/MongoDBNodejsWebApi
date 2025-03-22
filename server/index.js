// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
require('./config/mongoose');
const cors = require('cors')

//app.use(cors({ origin: '*', allowedHeaders:'*',methods:'*'}));
//app.options('*', cors());

// Custom CORS middleware
const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }
  next();
};

// Use the custom middleware
app.use(corsMiddleware);

// Hello World for index page
app.get('/', function (req, res) {
  return res.send("Hello World From Auth API!");
})

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  app.listen(process.env.port || 1337, () => {
    console.info(`server started on port ${process.env.port || 1337} (${config.env})`);
  });
}

module.exports = app;
