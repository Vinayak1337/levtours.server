import sgMail from "@sendgrid/mail";
import { config } from "dotenv";
const key = process.env.SEND_Grid;

export const Email = (email, title) => {
  const msg = {
    to: email, // Change to your recipient
    from: "hello@potionsofparadise.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };

  sgMail.setApiKey(process.env.SEND_Grid);
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
