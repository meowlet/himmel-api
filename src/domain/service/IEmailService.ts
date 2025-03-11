export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content?: any;
    path?: string;
  }>;
}

export interface IEmailService {
  sendMail(options: EmailOptions): Promise<boolean>;
  sendPasswordResetEmail(to: string, resetToken: string): Promise<boolean>;
  sendWelcomeEmail(to: string, username: string): Promise<boolean>;
}
