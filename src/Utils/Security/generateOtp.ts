import { emailEvent } from "../Events/email.event";

export class emailService {
  static sendWelcomeEmail = (email: string, username: string) => {
    emailEvent.emit("welcome", {
      to: email,
      username,
    });
  };

  static sendResetPasswordEmail = (email: string, username: string) => {
    emailEvent.emit("forgetpassword", {
      to: email,
      username,
    });
  };
}
