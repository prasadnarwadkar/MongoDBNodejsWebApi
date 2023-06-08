"use strict";
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = "mongodb://127.0.0.1:27017";
const db_name = "myNewDatabase";
const coll_name = "MyDocs";

// Driver Service. CRUD ops for NHVR authorized officer observations against registered drivers.
class FhirObservaionsService {
    constructor(req, res) {
        this.req = req
        this.res = res
    }

    insert(observation, db, callback) {
        db.db(db_name).collection(coll_name).insertOne(observation, function () {
            callback()
        })
    }

    update(observation, db, callback) {
        var newvalues = { $set: {Observation: observations.Observation,
                                flaggedTime: observations.flaggedTime,
                                interceptTime: observations.interceptTime,
                                location: observations.location,
                                timestamp: observations.timestamp
                             } };
        
        var myquery = {};
        myquery.ObservationId = observations.ObservationId;
        
        db.db(db_name).collection(coll_name).updateOne(myquery, newvalues, 
            function () {
            callback()
        })
    }

    updateObservation() {
        let self = this;
        let observation = this.req.body.observation;
        
        try {
            var options = { useNewUrlParser: true };
            console.log(url);

            MongoClient.connect(url, options, function (err, db) {
                assert.equal(null, err);
                self.update(observation, db, function () {
                    db.close()
                    return self.res.status(200).json({
                        status: 'success'
                    })
                })
            });
        }
        catch (error) {
            return self.res.status(500).json({
                status: 'error',
                error: error
            })
        }
    }

    addObservation() {
        let self = this;
        let observation = this.req.body.observation;
        
        try {
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                assert.equal(null, err);
                self.insert(observation, db, function () {
                    db.close()
                    return self.res.status(200).json({
                        status: 'success'
                    })
                })
            });
        }
        catch (error) {
            return self.res.status(500).json({
                status: 'error',
                error: error
            })
        }
    }
    
    getObservationsByDriverId(driverId) {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        let self = this;
        try {
            var options = {  useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                
                assert.equal(null, err);

                var myquery = {};
                myquery.driverId = driverId;

                db.db(db_name).collection(coll_name)
                    .find(myquery)
                    .toArray()
                    .then((observations) => {
                        response.data = observations;
                        self.res.json(response);
                    })
                    .catch(() => {
                        //sendError(err, res);
                    });
            });
        }
        catch (error) {
            return self.res.status(500).json({
                status: 'error',
                error: error
            })
        }
    }

    getObservations() {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        console.log("Url is " + url);

        let self = this;
        try {
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                
                assert.equal(null, err);

                db.db(db_name).collection(coll_name)
                    .find()
                    .toArray()
                    .then((observations) => {
                        response.data = observations.data;
                        //let reformattedArray = observations.map(({ id, code }) => ({ "id": id, "codes": code.coding }));
                        let reformattedArray = [];
                        observations.forEach(element => {
                            var elementToAdd = {};
                            elementToAdd.id = element.id;

                            if (element.code)
                            {
                                elementToAdd.codings = [];
                                element.code.coding.forEach(element2 => {
                                    let coding = {};
                                    coding.code = `${element2.code}`;
                                    coding.system = element2.system;
                                    coding.disp = element2.display;
                                    if (coding.disp != undefined)
                                    {
                                    elementToAdd.codings.push(coding);
                                    }
                                });

                            //elementToAdd.codings = element.code.coding;
                            reformattedArray.push(elementToAdd);
                            }
                        });
                        
                        console.log(reformattedArray);
                         self.res.json(reformattedArray);
                        //json(observations);
                    })
                    .catch(() => {
                        //sendError(err, res);
                    });
            });
        }
        catch (error) {
            return self.res.status(500).json({
                status: 'error',
                error: error
            })
        }
    }
}
module.exports = FhirObservaionsService
