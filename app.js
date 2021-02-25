"use strict";
const config = require('./server/config/config');
const express = require('express')
const heroesService  = require('./services/heroesService')
const driversService = require('./services/NHVRDriverService')
const annotService = require('./services/annotationsService')
const workRestEventsService = require('./services/workRestEventsService')
const twoUpEventsService = require('./services/twoUpEventsService')
const httpError = require('http-errors');


require('./server/config/mongoose');

const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./server/config/swagger.json');
const routes = require('./server/routes/index.route');

const passport = require('./server/config/passport')

const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended : false}))

var port = process.env.PORT || 1337;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use(passport.initialize());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API router
app.use('/api/', routes);

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   const err = new httpError(404)
//   return next(err);
// });

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {

  // customize Joi validation errors
  if (err.isJoi) {
    err.message = err.details.map(e => e.message).join("; ");
    err.status = 400;
  }

  res.status(err.status || 500).json({
    message: err.message
  });
  next(err);
});

app.post('/api/addHero', function (req, res) {
  let heroesServiceObj = new heroesService(req, res)
  heroesServiceObj.addHero()
})

app.post('/api/updateHero', function (req, res) {
  let heroesServiceObj = new heroesService(req, res)
  heroesServiceObj.updateHero()
})

app.get('/api/getHero', function (req, res) {
  let heroesServiceObj = new heroesService(req, res)
  heroesServiceObj.getHero()
})

app.get('/api/drivers', function (req, res) {
  let serviceObj = new driversService(req, res)
  serviceObj.getDrivers()
})

app.get('/api/annotations', function (req, res) {
  let serviceObj = new annotService(req, res)
  serviceObj.getAnnotations()
})

app.get('/api/annotations/driver/:id', function (req, res) {
  let serviceObj = new annotService(req, res)
  var id = req.params.id
  serviceObj.getAnnotationsByDriverId(id)
})

app.post('/api/annotations', function (req, res) {
  let serviceObj = new annotService(req, res)
  serviceObj.addAnnotation()
})

app.put('/api/annotations', function (req, res) {
  let serviceObj = new annotService(req, res)
  serviceObj.updateAnnotation()
})

app.get('/api/workrestevents', function (req, res) {
  let serviceObj = new workRestEventsService(req, res)
  serviceObj.getWorkRestEvents()
})

app.get('/api/workrestevents/driver/:id', function (req, res) {
  let serviceObj = new workRestEventsService(req, res)
  var id = req.params.id
  serviceObj.getWorkRestEventsByDriverId(id)
})

app.post('/api/workrestevents', function (req, res) {
  let serviceObj = new workRestEventsService(req, res)
  serviceObj.addWorkRestEvent()
})

app.put('/api/workrestevents', function (req, res) {
  let serviceObj = new workRestEventsService(req, res)
  serviceObj.updateWorkRestEvent()
})

app.get('/api/twoupevents', function (req, res) {
  let serviceObj = new twoUpEventsService(req, res)
  serviceObj.getTwoUpEvents()
})

app.get('/api/twoupevents/driver/:id', function (req, res) {
  let serviceObj = new twoUpEventsService(req, res)
  var id = req.params.id
  serviceObj.getTwoUpEventsByDriverId(id)
})

app.post('/api/twoupevents', function (req, res) {
  let serviceObj = new twoUpEventsService(req, res)
  serviceObj.addTwoUpEvent()
})

app.put('/api/twoupevents', function (req, res) {
  let serviceObj = new twoUpEventsService(req, res)
  serviceObj.updateTwoUpEvent()
})

app.listen(port, function () {
  console.log('NHVR EWD Web API listening on port '+ port+ '!')
})