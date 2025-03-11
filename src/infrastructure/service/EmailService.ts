import { injectable } from "tsyringe";
import nodemailer from "nodemailer";
import {
  EmailOptions,
  IEmailService,
} from "../../domain/service/IEmailService";
import { EmailConstant } from "../../common/constant/EmailConstant";
import { ConfigConstant } from "../../common/constant/ConfigConstant";

@injectable()
export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EmailConstant.SMTP_HOST,
      port: EmailConstant.SMTP_PORT,
      secure: EmailConstant.SMTP_PORT === 465,
      auth: {
        user: EmailConstant.SMTP_USER,
        pass: EmailConstant.SMTP_PASS,
      },
    });
  }

  async sendMail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Himmel" <${EmailConstant.SMTP_USER}>`,
        ...options,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }

  async sendPasswordResetEmail(
    to: string,
    resetToken: string
  ): Promise<boolean> {
    const resetUrl = `${ConfigConstant.CLIENT_URL}/reset-password?token=${resetToken}`;

    return this.sendMail({
      to,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  async sendWelcomeEmail(to: string, username: string): Promise<boolean> {
    return this.sendMail({
      to,
      subject: "Welcome to Himmel!",
      html: `
        <h1>Welcome to Himmel!</h1>
        <p>Hello ${username},</p>
        <p>Thank you for joining Himmel! We're excited to have you as part of our community.</p>
        <p>Start exploring our platform and discover amazing fiction content!</p>
        <p>Best regards,</p>
        <p>The Himmel Team</p>
      `,
    });
  }
}
