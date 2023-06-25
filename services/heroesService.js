"use strict";
const { MongoClient } = require('mongodb');
require('dotenv').config();

console.log('process.env.MONGO_HOST:' + process.env.MONGO_HOST);

// Uncomment the url which you need and comment the other. 
//const url = "mongodb://127.0.0.1:27017"; // Local Instance of MongoDB
const url = process.env.MONGO_HOST; // MongoDB Atlas Cluster


const db_name = "myNewDatabase";
const coll_name = "MyCollection";

const {
    v4: uuidv4,
} = require('uuid');

class HeroesService {
    constructor(req, res) {
        this.req = req
        this.res = res
    }

    insert(heroItem, client, callback) {
        var myobj = {};
        myobj.id = uuidv4();
        myobj.name = heroItem.name;

        client.db(db_name).collection(coll_name).insertOne(myobj, function () {
            callback()
        })
    }

    update(heroItem, client, callback) {
        var newvalues = { $set: { name: heroItem.name } };

        var myquery = {};
        myquery.id = heroItem.id;

        client.db(db_name).collection(coll_name).updateOne(myquery, newvalues,
            function () {
                callback()
            })
    }

    async addHero() {
        let doc = this.req.body.heroItem;

        console.log("Url is " + url);
        let self = this;
        const client = new MongoClient(url);

        try {
            // Connect to the MongoDB cluster
            await client.connect();

            self.insert(doc, client, function () {
                return self.res.status(200).json({
                    status: 'successful'
                })
            })
        }
        catch (e) {
            console.error(e);
        } finally {
            await client.close();
            console.log("Connection to MongoDB cluster closed");
        }
    }

    async addHero2() {
        let doc = this.req.body.hero;

        console.log("Url is " + url);
        let self = this;
        const client = new MongoClient(url);

        try {
            // Connect to the MongoDB cluster
            await client.connect();

            self.insert(doc, client, function () {
                return self.res.status(200).json({
                    status: 'successful'
                })
            })
        }
        catch (e) {
            console.error(e);
        } finally {
            await client.close();
            console.log("Connection to MongoDB cluster closed");
        }
    }

    async updateHero() {
        let doc = this.req.body.heroItem;

        console.log("Url is " + url);
        let self = this;
        const client = new MongoClient(url);

        try {
            // Connect to the MongoDB cluster
            await client.connect();

            self.update(doc, client, function () {
                return self.res.status(200).json({
                    status: 'successful'
                })
            })
        }
        catch (e) {
            console.error(e);
        } finally {
            await client.close();
            console.log("Connection to MongoDB cluster closed");
        }
    }

    async updateHero2() {
        let doc = this.req.body.hero;

        console.log("Url is " + url);
        let self = this;
        const client = new MongoClient(url);

        try {
            // Connect to the MongoDB cluster
            await client.connect();

            self.update(doc, client, function () {
                return self.res.status(200).json({
                    status: 'successful'
                })
            })
        }
        catch (e) {
            console.error(e);
        } finally {
            await client.close();
            console.log("Connection to MongoDB cluster closed");
        }
    }

    async getHero() {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        console.log("Url is " + url);
        let self = this;

        const client = new MongoClient(url);

        try {
            // Connect to the MongoDB cluster
            await client.connect();

            client.db(db_name).collection(coll_name)
                .find()
                .toArray()
                .then((objs) => {
                    response.data = objs;
                    
                    self.res.json(response);

                })
                .catch((e) => {
                    console.error(e);
                });

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
            console.log("Connection to MongoDB cluster closed");
        }
    }

    async getHeroDirect() {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        console.log("Url is " + url);
        let self = this;

        const client = new MongoClient(url);

        try {
            // Connect to the MongoDB cluster
            await client.connect();

            client.db(db_name).collection(coll_name)
                .find()
                .toArray()
                .then((objs) => {
                    response.data = objs;
                    db.close()
                    self.res.json(response.data);

                })
                .catch((e) => {
                    console.error(e);
                });

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
            console.log("Connection to MongoDB cluster closed");
        }
    }

    async getHero2() {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        console.log("Url is " + url);
        let self = this;

        const client = new MongoClient(url);

        try {
            // Connect to the MongoDB cluster
            await client.connect();

            client.db(db_name).collection(coll_name)
                .find()
                .toArray()
                .then((objs) => {
                    response.data = objs;
                    db.close()
                    self.res.json(response.data);

                })
                .catch((e) => {
                    console.error(e);
                });

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
            console.log("Connection to MongoDB cluster closed");
        }
    }
}

module.exports = HeroesService
