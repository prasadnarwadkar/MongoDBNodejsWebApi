"use strict";
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = "mongodb://localhost:27017";
const db_name = "mean";
const coll_name = "Heroes";

const user_name = 'prasadn_140274';
const password = 'Tetya123';

class HeroesService {
    constructor(req, res) {
        this.req = req
        this.res = res
    }

    insert(heroItem, db, callback) {
        var myobj = {};
        myobj.id = Math.floor(Math.random() * (1000 - 1) + 1);
        myobj.name = heroItem.name;

        db.db(db_name).collection(coll_name).insertOne(myobj, function () {
            callback()
        })
    }

    update(heroItem, db, callback) {
        var newvalues = { $set: {name: heroItem.name } };
        
        var myquery = {};
        myquery.id = heroItem.id;
        
        db.db(db_name).collection(coll_name).updateOne(myquery, newvalues, 
            function () {
            callback()
        })
    }

    addHero() {
        console.log('In service');
        let self = this;
        let heroItem = this.req.body.heroItem;
        console.log(heroItem.name);
        try {
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                assert.equal(null, err);
                self.insert(heroItem, db, function () {
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

    getHero() {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        let self = this;
        let heroList = [];
        try {
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                console.log('get hero');
                assert.equal(null, err);

                db.db(db_name).collection(coll_name)
                    .find()
                    .toArray()
                    .then((users) => {
                        response.data = users;
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
module.exports = HeroesService
