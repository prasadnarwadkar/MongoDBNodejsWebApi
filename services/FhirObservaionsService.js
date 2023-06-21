"use strict";
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const assert = require('assert');

const url = process.env.MONGO_HOST;
const db_name = "myNewDatabase";
const coll_name = "MyDocs";

class FhirObservaionsService {
    constructor(req, res) {
        this.req = req
        this.res = res
    }

    insert(observation, client, callback) {
        client.db(db_name).collection(coll_name).insertOne(observation, function () {
            callback()
        })
    }

    async addObservation() {
        let observation = this.req.body.observation;

        console.log("Url is " + url);
        let self = this;
        var options = { useNewUrlParser: true };
        const client = new MongoClient(url);

        try {
            // Connect to the MongoDB cluster
            await client.connect();

            self.insert(observation, client, function () {
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

    async getObservations() {
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
                .then((observations) => {
                    response.data = observations.data;

                    let reformattedArray = [];
                    observations.forEach(element => {
                        var elementToAdd = {};
                        elementToAdd.id = element.id;

                        if (element.code) {
                            elementToAdd.codings = [];
                            element.code.coding.forEach(element2 => {
                                let coding = {};
                                coding.code = `${element2.code}`;
                                coding.system = element2.system;
                                coding.disp = element2.display;
                                if (coding.disp != undefined) {
                                    elementToAdd.codings.push(coding);
                                }
                            });

                            reformattedArray.push(elementToAdd);
                        }
                    });

                    console.log(reformattedArray);

                    self.res.json(reformattedArray);

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

module.exports = FhirObservaionsService
