"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSubject = exports.emailEvent = void 0;
const xoauth2_1 = require("nodemailer/lib/xoauth2");
const htmlEmail_1 = require("../Email/htmlEmail");
const sendEmail_1 = require("../Email/sendEmail");
exports.emailEvent = new xoauth2_1.EventEmitter();
exports.emailSubject = {
    confirmEmail: "Confirm Your Email",
    resetPassword: "Reset Your Password",
    welcome: "Welcome To Heart Disease Prediction",
};
exports.emailEvent.on("welcome", async (data) => {
    try {
        data.subject = exports.emailSubject.welcome;
        data.html = (0, htmlEmail_1.template)(data.username, data.subject);
        await (0, sendEmail_1.sendEmail)(data);
    }
    catch (err) {
        console.log(`Error sending welcome platform email: ${err}`);
    }
});
exports.emailEvent.on("forgetpassword", async (data) => {
    try {
        data.subject = exports.emailSubject.resetPassword;
        data.html = (0, htmlEmail_1.template)(data.username, exports.emailSubject.resetPassword);
        await (0, sendEmail_1.sendEmail)(data);
    }
    catch (err) {
        console.log(`Error sending reset password email: ${err}`);
    }
});
