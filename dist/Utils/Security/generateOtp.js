"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const email_event_1 = require("../Events/email.event");
class emailService {
    static sendWelcomeEmail = (email, username) => {
        email_event_1.emailEvent.emit("welcome", {
            to: email,
            username,
        });
    };
    static sendResetPasswordEmail = (email, username) => {
        email_event_1.emailEvent.emit("forgetpassword", {
            to: email,
            username,
        });
    };
}
exports.emailService = emailService;
