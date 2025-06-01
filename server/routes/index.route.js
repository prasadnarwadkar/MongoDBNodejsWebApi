const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const router = express.Router(); // eslint-disable-line new-cap
const crypto = require('crypto');
const connectDB = require('../config/mongodbservice');
const { sendSimpleMessage } = require('../../services/emailservice');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv")
dotenv.config()
const MongoClient = require("mongodb")
const streamifier = require('streamifier');

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);
const multer = require("multer");
const upload = multer();

router.post("/getProfilePic", async (req, res) => {
  let db = await connectDB()

  const bucket = new MongoClient.GridFSBucket(db, { bucketName: 'myFileBucket' });

  const cursor = bucket.find({ metadata: { field: 'user_id', value: req.body.id } });
  for await (const doc of cursor) {
    return res.status(200).send(doc.filename.buffer)
  }
});

router.post("/uploadProfilePic2", upload.single("file"), async (req, res) => {
  let db = await connectDB()
  const bucket = new MongoClient.GridFSBucket(db, { bucketName: 'myFileBucket' });

  const cursor = bucket.find({ metadata: { field: 'user_id', value: req.body.data } });

  let ids = [];
  for await (const doc of cursor) {
    
    ids.push(doc._id)
  }

  cursor.close()

  const uploadStream = bucket.openUploadStream(req.file, {
    chunkSizeBytes: 1048576,
    metadata: { field: 'user_id', value: req.body.data }
  });

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream).on("finish", async () => {

    let db = await connectDB()
    let updateResult = await db.collection("users").updateOne({ _id: MongoClient.ObjectId(req.body.data) }, { $set: { picData: req.file.buffer } })

    ids.forEach(async (value, index) => {
      bucket.delete(MongoClient.ObjectId(value));
    });

    res.sendStatus(200)
  })
    .on("error", (err) => {
      console.error("Upload failed:", err);
      res.sendStatus(500).write(err)
    });
});

router.post('/forgot-password', async (req, res) => {
  try {
    let db = await connectDB()

    let user = await db.collection("users").findOne({ "email": req.body.email })

    if (!user) return res.status(404).send('User not found.');

    // Generate token
    const token = crypto.randomBytes(20).toString('hex');

    // Set token and expiration
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    let updateResult = await db.collection("users").updateOne({ "email": req.body.email },
      { $set: { resetPasswordToken: token, resetPasswordExpires: user.resetPasswordExpires } })
    

    let resetPasswordLink = `${process.env.RESET_PWD_LINK_BASE_URL}/${user.resetPasswordToken}`
    await sendSimpleMessage(process.env.MAILGUN_DOMAIN_FROM_ID || "",
      req.body.email,
      "Reset Password link",
      `You are receiving this because you (or someone else) have requested to reset your password.\n\n
      Please click on the following link, or paste it into your browser to complete the process:\n\n
      ${resetPasswordLink}\n\n
      If you did not request this, please ignore this email.`
    )



    res.status(200).send('Password reset email sent.');
  } catch (err) {
    res.status(500).send('Error sending email.');
  }
});


router.post('/reset-password/:token', async (req, res) => {
  try {
    let db = await connectDB()
    let user = await db.collection("users").findOne({ "resetPasswordToken": req.params.token, resetPasswordExpires: { $gt: Date.now() } })

    if (!user) return res.status(400).send('Password reset token is invalid or has expired.');

    // Update password
    user.hashedPassword = bcrypt.hashSync(req.body.password, 10)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await db.collection("users").updateOne({ "resetPasswordToken": req.params.token },
      { $set: { resetPasswordToken: undefined, hashedPassword: user.hashedPassword, resetPasswordExpires: undefined } })

    res.status(200).send('Password has been reset.');
  } catch (err) {
    res.status(500).send('Error resetting password.');
  }
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

module.exports = router;
