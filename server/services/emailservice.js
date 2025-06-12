const FormData = require("form-data")
const Mailgun = require("mailgun.js")
const dotenv = require("dotenv")
dotenv.config()

let key = process.env.API_KEY || ""
async function sendSimpleMessage(from, to, cc, subject, text) {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: key,
  });
  try {
    if (cc?.length < 1) {
      const data = await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
        from: from,
        to: to,
        subject: subject,
        text: text,
      });

      return data
    }
    else {
      const data = await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
        from: from,
        to: to,
        cc: cc,
        subject: subject,
        text: text,
      });

      return data
    }

    
  } catch (error) {
    throw error
  }
}

module.exports = sendSimpleMessage