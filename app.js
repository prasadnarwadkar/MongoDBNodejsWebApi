"use strict"
// ***************************************************************************
// Bank API code from Web Dev For Beginners project
// https://github.com/microsoft/Web-Dev-For-Beginners/tree/main/7-bank-project/api
// ***************************************************************************

import express, { Router } from 'express';
import pkg from 'body-parser';
const { urlencoded, json } = pkg;
import cors from 'cors';



// App constants
const port = process.env.port || 3002;
const apiPrefix = '/api';




  
// Create the Express app & setup middlewares
const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

app.use(cors({ origin: '*', allowedHeaders:'*',methods:'*'}));
app.options('*', cors());

import heroesService from './services/heroesService.js';

import observationService from './services/FhirObservationsService.js';

import connectDB from './services/hospitalService.js';



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
const router = Router();

// All OPTIONS requests return a simple status: 'OK'
// app.options('*', (req, res) => {
//   res.json({
//     status: 'OK'
//   });
// });





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
let db;
db = await connectDB();

// **Patients Endpoints**
app.post("/patients", async (req, res) => res.json(await db.collection("patients").insertOne(req.body)));
app.get("/patients", async (req, res) => res.json(await db.collection("patients").find().toArray()));
app.get("/patients/:id", async (req, res) => res.json(await db.collection("patients").find({"id": req.params.id}).toArray()));
app.put("/patients/:id", async (req, res) => res.json(await db.collection("patients").updateOne({ id: req.params.id }, { $set: req.body })));
app.delete("/patients/:id", async (req, res) => res.json(await db.collection("patients").deleteOne({ id: req.params.id })));

// **Doctors Endpoints**
app.post("/doctors", async (req, res) => res.json(await db.collection("doctors").insertOne(req.body)));
app.get("/doctors", async (req, res) => res.json(await db.collection("doctors").find().toArray()));
app.put("/doctors/:id", async (req, res) => res.json(await db.collection("doctors").updateOne({ id: req.params.id }, { $set: req.body })));
app.delete("/doctors/:id", async (req, res) => res.json(await db.collection("doctors").deleteOne({ id: req.params.id })));

// **Medical Records Endpoints**
app.post("/records", async (req, res) => res.json(await db.collection("medical_records").insertOne(req.body)));
app.get("/records", async (req, res) => res.json(await db.collection("medical_records").find().toArray()));
app.put("/records/:id", async (req, res) => res.json(await db.collection("medical_records").updateOne({ id: req.params.id }, { $set: req.body })));
app.delete("/records/:id", async (req, res) => res.json(await db.collection("medical_records").deleteOne({ id: req.params.id })));

// **Billing Endpoints**
app.post("/billing", async (req, res) => res.json(await db.collection("billing").insertOne(req.body)));
app.get("/billing", async (req, res) => res.json(await db.collection("billing").find().toArray()));
app.put("/billing/:id", async (req, res) => res.json(await db.collection("billing").updateOne({ id: req.params.id }, { $set: req.body })));
app.delete("/billing/:id", async (req, res) => res.json(await db.collection("billing").deleteOne({ id: req.params.id })));



// Add 'api` prefix to all routes
app.use(apiPrefix, router);

// Hello World for index page
app.get('/', function (req, res) {
  return res.send("Hello World!");
})

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
  