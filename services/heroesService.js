"use strict";
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = "mongodb://127.0.0.1:27017";

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

    sendCellNumbToTwilioForVerif() {
        console.log('In service: sendCellNumbToTwilioForVerif');
        let self = this;
        let cellNumber = this.req.body.cellNum;
        console.log(cellNumber.num);
        try {

            const REACT_TWILIO_ACSID='<REACT_TWILIO_ACSID>';
            const REACT_TWILIO_AUTHTOKEN='<REACT_TWILIO_AUTHTOKEN>';
            const REACT_TWILIO_VERIFY_SID='<REACT_TWILIO_VERIFY_SID>';

            // Get your account SID and Auth token in your Twilio console. 
            // Create a Twilio account by signing up. 
            const accountSid = REACT_TWILIO_ACSID;
            const authToken = REACT_TWILIO_AUTHTOKEN;

            const client = require('twilio')(accountSid, authToken);
            const mobilePhone = cellNumber.num;

            // Send the user a code on their whatsapp number to verfy their number. 
            // Create a simple verify service in your Twilio console and use its SID here. 

            client.verify.v2.services(REACT_TWILIO_VERIFY_SID)
                .verifications
                .create({ to: mobilePhone, channel: 'whatsapp' })
                .then(verification_check => {
                    console.log(JSON.stringify(verification_check));
                    console.log(verification_check.status)
                    let statusStr = verification_check.status
                    return self.res.status(200).json({
                        status: statusStr
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

    sendOtpForVerif() {
        console.log('In service: sendOtpForVerif');
        let self = this;
        let otpNumber = this.req.body.otpInfo;
        let otp = this.req.body.otpInfo.otp;

        console.log(otpNumber.num);
        try {

            const REACT_TWILIO_ACSID='<REACT_TWILIO_ACSID>';
            const REACT_TWILIO_AUTHTOKEN='<REACT_TWILIO_AUTHTOKEN>';
            const REACT_TWILIO_VERIFY_SID='<REACT_TWILIO_VERIFY_SID>';

            // Get your account SID and Auth token in your Twilio console. 
            // Create a Twilio account by signing up. 
            const accountSid = REACT_TWILIO_ACSID;
            const authToken = REACT_TWILIO_AUTHTOKEN;

            const client = require('twilio')(accountSid, authToken);
            const mobilePhone = otpNumber.num;

            client.verify.v2.services(REACT_TWILIO_VERIFY_SID)
                .verificationChecks
                .create({ to: mobilePhone, code: otp })
                .then(verification_check => 
                    {
                        console.log(verification_check.status)
                        let statusStr = verification_check.status
                        return self.res.status(200).json({
                        status: statusStr
                    });
                    })
                    .catch((error) => 
                    {
                        console.log("error");
                        console.log(error);

                        if (error.status == "404"
                        || error.status == 404)
                        {
                            return self.res.status(404).json({
                                status: 'error',
                                error: 'Either the OTP has already been verified or the OTP is incorrect.'
                            })
                        }
                        else
                        {
                            return self.res.status(500).json({
                                status: 'error',
                                error: error
                            })
                        }
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

    updateHero2() {
        console.log('Update hero In service');
        let self = this;
        let heroItem = this.req.body.hero;
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
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                console.log('get hero');
                assert.equal(null, err);

                db.db(db_name).collection(coll_name)
                    .find()
                    .toArray()
                    .then((users) => {
                        response.data = users;
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
            var options = { useNewUrlParser: true };

            MongoClient.connect(url, options, function (err, db) {
                console.log('get hero direct');
                assert.equal(null, err);

                db.db(db_name).collection(coll_name)
                    .find()
                    .toArray()
                    .then((users) => {
                        response.data = users;
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
