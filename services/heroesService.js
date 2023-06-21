"use strict";
const { MongoClient, ServerApiVersion } = require('mongodb');
const assert = require('assert');
require('dotenv').config();


console.log('process.env.MONGO_HOST:'+ process.env.MONGO_HOST);

// Uncomment the url which you need and comment the other. 
//const url = "mongodb://127.0.0.1:27017"; // Local Instance of MongoDB
const url = process.env.MONGO_HOST; // MongoDB Atlas Cluster

const options = {
    useNewUrlParser: true,
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
};

const db_name = "myNewDatabase";
const coll_name = "myCollection";

const {
    v4: uuidv4,
} = require('uuid');

class HeroesService {
    constructor(req, res) {
        this.req = req
        this.res = res
    }

    insert(heroItem, db, callback) {
        var myobj = {};
        myobj.id = uuidv4();
        myobj.name = heroItem.name;

        db.db(db_name).collection(coll_name).insertOne(myobj, function () {
            callback()
        })
    }

    update(heroItem, db, callback) {
        var newvalues = { $set: { name: heroItem.name } };

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

    
    addHero2() {
        console.log('In service');
        let self = this;
        let heroItem = this.req.body.hero;
        console.log(heroItem.name);
        try {
            
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

    updateHero2() {
        console.log('Update hero In service');
        let self = this;
        let heroItem = this.req.body.hero;
        console.log(heroItem.name);
        try {
            
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

    getHero2() {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        let self = this;
        let heroList = [];
        try {
            
            MongoClient.connect(url, options, function (err, db) {
                console.log('get hero');
                assert.equal(null, err);

                db.db(db_name).collection(coll_name)
                    .find()
                    .toArray()
                    .then((users) => {
                        response.data = users;
                        db.close()
                        self.res.json(response.data);
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
            

            MongoClient.connect(url, options, function (err, db) {
                console.log('get hero');
                assert.equal(null, err);

                db.db(db_name).collection(coll_name)
                    .find()
                    .toArray()
                    .then((users) => {
                        response.data = users;
                        db.close()
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


    getHeroDirect() {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        let self = this;
        let heroList = [];
        try {
            
            MongoClient.connect(url, options, function (err, db) {
                console.log('get hero direct');
                assert.equal(null, err);

                db.db(db_name).collection(coll_name)
                    .find()
                    .toArray()
                    .then((users) => {
                        response.data = users;
                        db.close()
                        self.res.json(response.data);
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
