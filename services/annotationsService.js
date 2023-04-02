"use strict";
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = process.env.MONGO_HOST;
const db_name = "TestDb";
const coll_name = "MyDocs";

const user_name = 'prasadn_140274';
const password = 'Tetya123';

// Driver Service. CRUD ops for NHVR authorized officer annotations against registered drivers.
class NHVRAnnotationService {
    constructor(req, res) {
        this.req = req
        this.res = res
    }

    insert(annotation, db, callback) {
        db.db(db_name).collection(coll_name).insertOne(annotation, function () {
            callback()
        })
    }

    update(annotation, db, callback) {
        var newvalues = { $set: {Annotation: annotation.Annotation,
                                flaggedTime: annotation.flaggedTime,
                                interceptTime: annotation.interceptTime,
                                location: annotation.location,
                                timestamp: annotation.timestamp
                             } };
        
        var myquery = {};
        myquery.AnnotationId = annotation.AnnotationId;
        
        db.db(db_name).collection(coll_name).updateOne(myquery, newvalues, 
            function () {
            callback()
        })
    }

    updateAnnotation() {
        let self = this;
        let annoItem = this.req.body.annotItem;
        
        try {
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                assert.equal(null, err);
                self.update(annoItem, db, function () {
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

    addAnnotation() {
        let self = this;
        let annoItem = this.req.body.annotItem;
        
        try {
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                assert.equal(null, err);
                self.insert(annoItem, db, function () {
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
    
    getAnnotationsByDriverId(driverId) {
        // Response handling
        let response = {
            status: 200,
            data: [],
            message: null
        };

        let self = this;
        let heroList = [];
        try {
            var options = {  useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                
                assert.equal(null, err);

                var myquery = {};
                myquery.driverId = driverId;

                db.db(db_name).collection(coll_name)
                    .find(myquery)
                    .toArray()
                    .then((annotations) => {
                        response.data = annotations;
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

    getAnnotations() {
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
                
                assert.equal(null, err);

                db.db(db_name).collection(coll_name)
                    .find()
                    .toArray()
                    .then((annotations) => {
                        response.data = annotations.data;
                        //let reformattedArray = annotations.map(({ id, code }) => ({ "id": id, "codes": code.coding }));
                        let reformattedArray = [];
                        annotations.forEach(element => {
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
                        //json(annotations);
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
module.exports = NHVRAnnotationService
