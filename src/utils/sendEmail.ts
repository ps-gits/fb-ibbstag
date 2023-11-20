// sendEmail.ts

import * as sgMail from '@sendgrid/mail';
import { SENDGRID } from '@config';

// Set your SendGrid API key
sgMail.setApiKey(SENDGRID);

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  text: string;
}

function sendEmail({ to, from, subject, text }: EmailOptions): Promise<sgMail.Response> {
  const msg: sgMail.MailDataRequired = {
    to,
    from, // Use the email address associated with your SendGrid account
    subject,
    text,
  };

  return sgMail.send(msg);
}

export default sendEmail;
