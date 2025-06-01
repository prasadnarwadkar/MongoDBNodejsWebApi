import FormData from "form-data";
import Mailgun from "mailgun.js";

import dotenv from 'dotenv'
dotenv.config()

let key = process.env.API_KEY || ""
export async function sendSimpleMessage(from,to,subject,text) {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: key,
  });
  try {
    const data = await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
      from: from,
      to: to,
      subject: subject,
      text: text,
    });

    return data
  } catch (error) {
    console.log(error);
  }
}