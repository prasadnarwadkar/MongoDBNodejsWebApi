"use strict";
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = "mongodb://localhost:27017";
const db_name = "mean";

const coll_name = "twoupevents";
const user_name = 'prasadn_140274';
const password = 'Tetya123';

// Driver Service. CRUD ops for NHVR driver two up change event (start or stop)
class TwoUpEventsService {
    constructor(req, res) {
        this.req = req
        this.res = res
    }

    insert(twoupevent, db, callback) {
        db.db(db_name).collection(coll_name).insertOne(twoupevent, function () {
            callback()
        })
    }

    update(twoupevent, db, callback) {
        var newvalues = { $set: {eventType: twoupevent.eventType,                                
                                workRestOption: twoupevent.workRestOption,
                                twoUpDriverId: twoupevent.twoUpDriverId,
                                timestamp: twoupevent.timestamp
                             } };
        
        var myquery = {};
        myquery.TwoUpEventId = twoupevent.TwoUpEventId;
        
        db.db(db_name).collection(coll_name).updateOne(myquery, newvalues, 
            function () {
            callback()
        })
    }

    updateTwoUpEvent() {
        let self = this;
        let twoUpEventItem = this.req.body.twoUpEventItem;
        
        try {
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                assert.equal(null, err);
                self.update(twoUpEventItem, db, function () {
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

    addTwoUpEvent() {
        let self = this;
        let twoUpEventItem = this.req.body.twoUpEventItem;
        
        try {
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                assert.equal(null, err);
                self.insert(twoUpEventItem, db, function () {
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
    
    getTwoUpEventsByDriverId(driverId) {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        let self = this;
        
        try {
            var options = { 
            //     auth: {
            //     user: user_name,
            //     password: password,
            //    }, 
               useNewUrlParser: true };

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

    getTwoUpEvents() {
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
module.exports = TwoUpEventsService
