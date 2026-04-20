import { EventEmitter } from "nodemailer/lib/xoauth2";
import Mail from "nodemailer/lib/mailer";
import { template } from "../Email/htmlEmail";
import { sendEmail } from "../Email/sendEmail";
export const emailEvent = new EventEmitter();

export interface IEmail extends Mail.Options {
  username: string;
}

export const emailSubject = {
  confirmEmail: "Confirm Your Email",
  resetPassword: "Reset Your Password",
  welcome: "Welcome To Heart Disease Prediction",
};

emailEvent.on("welcome", async (data: IEmail) => {
  try {
    data.subject = emailSubject.welcome;
    data.html = template(data.username, data.subject);
    await sendEmail(data);
  } catch (err) {
    console.log(`Error sending welcome platform email: ${err}`);
  }
});
emailEvent.on("forgetpassword", async (data: IEmail) => {
  try {
    data.subject = emailSubject.resetPassword;
    data.html = template(data.username, emailSubject.resetPassword);
    await sendEmail(data);
  } catch (err) {
    console.log(`Error sending reset password email: ${err}`);
  }
});
