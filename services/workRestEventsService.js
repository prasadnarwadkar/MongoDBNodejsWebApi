"use strict";
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = "mongodb://localhost:27017";
const db_name = "mean";

const coll_name = "workrestevents";
const user_name = 'prasadn_140274';
const password = 'Tetya123';

// Driver Service. CRUD ops for NHVR driver work rest events.
class WorkRestEventsService {
    constructor(req, res) {
        this.req = req
        this.res = res
    }

    insert(workrestevent, db, callback) {
        db.db(db_name).collection(coll_name).insertOne(workrestevent, function () {
            callback()
        })
    }

    update(workrestevent, db, callback) {
        var newvalues = { $set: {EventType: workrestevent.EventType,
                                historicData: workrestevent.historicData,
                                odometer: workrestevent.odometer,
                                location: workrestevent.location,
                                timestamp: workrestevent.timestamp,
                                startTime: workrestevent.startTime
                             } };
        
        var myquery = {};
        myquery.WorkRestEventId = workrestevent.WorkRestEventId;
        
        db.db(db_name).collection(coll_name).updateOne(myquery, newvalues, 
            function () {
            callback()
        })
    }

    updateWorkRestEvent() {
        let self = this;
        let workRestEventItem = this.req.body.workRestEventItem;
        
        try {
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                assert.equal(null, err);
                self.update(workRestEventItem, db, function () {
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

    addWorkRestEvent() {
        let self = this;
        let workRestEventItem = this.req.body.workRestEventItem;
        
        try {
            var options = {  useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                assert.equal(null, err);
                self.insert(workRestEventItem, db, function () {
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
    
    getWorkRestEventsByDriverId(driverId) {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        let self = this;
        
        try {
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                
                assert.equal(null, err);

                var myquery = {};
                myquery.driverId = driverId;

                db.db(db_name).collection(coll_name)
                    .find(myquery)
                    .toArray()
                    .then((events) => {
                        response.data = events;
                        self.res.json(response);
                    })
                    .catch((err) => {
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

    getWorkRestEvents() {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        let self = this;
        
        try {
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                
                assert.equal(null, err);

                db.db(db_name).collection(coll_name)
                    .find()
                    .toArray()
                    .then((events) => {
                        response.data = events;
                        self.res.json(response);
                    })
                    .catch((err) => {
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
module.exports = WorkRestEventsService
