"use strict";
import pkg from 'mongodb';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
const { MongoClient } = pkg;
dotenv.config();



// Uncomment the url which you need and comment the other. 
const url = process.env.MONGO_HOST; // MongoDB Atlas Cluster


const db_name = "myNewDatabase";
const coll_name = "MyCollection";


export default class HeroesService {
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
        myquery =  {id: { $eq: heroItem.id }};

        client.db(db_name).collection(coll_name).updateOne(myquery, newvalues,
            function () {
                callback()
            })
    }

    async addHero() {
        let doc = this.req.body.heroItem;

        
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
            
        }
    }

    async addHero2() {
        let doc = this.req.body.hero;

        
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
            
        }
    }

    async updateHero() {
        let doc = this.req.body.heroItem;

        
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
            
        }
    }

    async updateHero2() {
        let doc = this.req.body.hero;

        
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
            
        }
    }

    async getHero() {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        
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
            
        }
    }

    async getHeroDirect() {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        
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
                    
                    self.res.json(response.data);

                })
                .catch((e) => {
                    console.error(e);
                });

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
            
        }
    }

    async getHero2() {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        
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
                    
                    self.res.json(response.data);

                })
                .catch((e) => {
                    console.error(e);
                });

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
            
        }
    }
}


