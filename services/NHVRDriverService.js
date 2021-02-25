"use strict";
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = "mongodb://localhost:27017";
const db_name = "mean";
const coll_name = "drivers";

const user_name = 'prasadn_140274';
const password = 'Tetya123';

// Driver Service. CRUD ops for NHVR registered drivers.
class NHVRDriverService {
    constructor(req, res) {
        this.req = req
        this.res = res
    }

    insert(driver, db, callback) {
        db.db(db_name).collection(coll_name).insertOne(driver, function () {
            callback()
        })
    }

    update(driver, db, callback) {
        var newvalues = { $set: {name: driver.name } };
        
        var myquery = {};
        myquery.id = driver.id;
        
        db.db(db_name).collection(coll_name).updateOne(myquery, newvalues, 
            function () {
            callback()
        })
    }

    

    updateHero() {
        console.log('Update hero In service');
        let self = this;
        let heroItem = this.req.body.heroItem;
        console.log(heroItem.name);
        try {
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                assert.equal(null, err);
                self.update(heroItem, db, function () {
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

    getDrivers() {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        let self = this;
        let heroList = [];
        try {
            var options = {useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                console.log('get drivers');
                assert.equal(null, err);

                db.db(db_name).collection(coll_name)
                    .find()
                    .toArray()
                    .then((drivers) => {
                        response.data = drivers;
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
module.exports = NHVRDriverService
