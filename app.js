"use strict"
// ***************************************************************************
// Bank API code from Web Dev For Beginners project
// https://github.com/microsoft/Web-Dev-For-Beginners/tree/main/7-bank-project/api
// ***************************************************************************

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')



// App constants
const port = process.env.port || 3002;
const apiPrefix = '/api';




  
// Create the Express app & setup middlewares
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({ origin: '*'}));
app.options('*', cors());

const heroesService  = require('./services/heroesService')

const observationService = require('./services/FhirObservationsService')


app.get('/api/observations', function (req, res) {
  let serviceObj = new observationService(req, res)
  serviceObj.getObservations()
})

app.post('/api/observations', function (req, res) {
  let serviceObj = new observationService(req, res)
  serviceObj.addObservation()
})

// ***************************************************************************

// Configure routes
const router = express.Router();

// Hello World for index page
app.get('/', function (req, res) {
    return res.send("Hello World!");
})

app.get('/api', function (req, res) {
    return res.send("Fabrikam Bank API");
})

app.post('/api/addHero', function (req, res) {
  let heroesServiceObj = new heroesService(req, res)
  heroesServiceObj.addHero()
})

app.post('/api/addHero2', function (req, res) {
  let heroesServiceObj = new heroesService(req, res)
  heroesServiceObj.addHero2()
})

app.post('/api/updateHero', function (req, res) {
  let heroesServiceObj = new heroesService(req, res)
  heroesServiceObj.updateHero()
})

app.post('/api/updateHero2', function (req, res) {
  let heroesServiceObj = new heroesService(req, res)
  heroesServiceObj.updateHero2()
})

app.get('/api/getHero', function (req, res) {
  let heroesServiceObj = new heroesService(req, res)
  heroesServiceObj.getHero()
})

app.get('/api/getHeroDirect', function (req, res) {
  let heroesServiceObj = new heroesService(req, res)
  heroesServiceObj.getHeroDirect()
})

app.get('/api/getHero2', function (req, res) {
  let heroesServiceObj = new heroesService(req, res)
  heroesServiceObj.getHero2()
})
  
// ***************************************************************************


// Add 'api` prefix to all routes
app.use(apiPrefix, router);

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
  