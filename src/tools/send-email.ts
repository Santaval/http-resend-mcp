import { z } from "zod";
import { type InferSchema } from "xmcp";
import { Resend } from "resend";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get API key from environment variable
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error(
    'No API key provided. Please set RESEND_API_KEY environment variable'
  );
}

const resend = apiKey ? new Resend(apiKey) : null;

// Get optional configuration from environment variables
const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
let replierEmailAddresses: string[] = [];

if (process.env.REPLY_TO_EMAIL_ADDRESSES) {
  replierEmailAddresses = process.env.REPLY_TO_EMAIL_ADDRESSES.split(',');
}

// Define the schema for tool parameters
export const schema = {
  to: z.string().email().describe('Recipient email address'),
  subject: z.string().describe('Email subject line'),
  text: z.string().describe('Plain text email content'),
  html: z
    .string()
    .optional()
    .describe(
      'HTML email content. When provided, the plain text argument MUST be provided as well.',
    ),
  cc: z
    .string()
    .email()
    .array()
    .optional()
    .describe(
      'Optional array of CC email addresses. You MUST ask the user for this parameter. Under no circumstance provide it yourself',
    ),
  bcc: z
    .string()
    .email()
    .array()
    .optional()
    .describe(
      'Optional array of BCC email addresses. You MUST ask the user for this parameter. Under no circumstance provide it yourself',
    ),
  scheduledAt: z
    .string()
    .optional()
    .describe(
      "Optional parameter to schedule the email. This uses natural language. Examples would be 'tomorrow at 10am' or 'in 2 hours' or 'next day at 9am PST' or 'Friday at 3pm ET'.",
    ),
  // If sender email address is not provided, require it as an argument
  ...(!senderEmailAddress
    ? {
        from: z
          .string()
          .email()
          .nonempty()
          .describe(
            'Sender email address. You MUST ask the user for this parameter. Under no circumstance provide it yourself',
          ),
      }
    : {}),
  ...(replierEmailAddresses.length === 0
    ? {
        replyTo: z
          .string()
          .email()
          .array()
          .optional()
          .describe(
            'Optional email addresses for the email readers to reply to. You MUST ask the user for this parameter. Under no circumstance provide it yourself',
          ),
      }
    : {}),
};

// Define tool metadata
export const metadata = {
  name: "send-email",
  description: "Send an email using Resend",
  annotations: {
    title: "Send Email via Resend",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
  },
};

// Tool implementation
export default async function sendEmail(params: InferSchema<typeof schema>) {
  if (!resend) {
    throw new Error('Resend API key not configured. Please set RESEND_API_KEY environment variable.');
  }

  const { from, to, subject, text, html, replyTo, scheduledAt, cc, bcc } = params;
  
  const fromEmailAddress = from ?? senderEmailAddress;
  const replyToEmailAddresses = replyTo ?? replierEmailAddresses;

  // Type check on from, since "from" is optionally included in the arguments schema
  if (typeof fromEmailAddress !== 'string') {
    throw new Error('from argument must be provided.');
  }

  // Similar type check for "reply-to" email addresses.
  if (
    typeof replyToEmailAddresses !== 'string' &&
    !Array.isArray(replyToEmailAddresses)
  ) {
    throw new Error('replyTo argument must be provided.');
  }

  console.error(`Debug - Sending email with from: ${fromEmailAddress}`);

  // Explicitly structure the request with all parameters
  const emailRequest: {
    to: string;
    subject: string;
    text: string;
    from: string;
    replyTo: string | string[];
    html?: string;
    scheduledAt?: string;
    cc?: string[];
    bcc?: string[];
  } = {
    to,
    subject,
    text,
    from: fromEmailAddress,
    replyTo: replyToEmailAddresses,
  };

  // Add optional parameters conditionally
  if (html) {
    emailRequest.html = html;
  }

  if (scheduledAt) {
    emailRequest.scheduledAt = scheduledAt;
  }

  if (cc) {
    emailRequest.cc = cc;
  }

  if (bcc) {
    emailRequest.bcc = bcc;
  }

  console.error(`Email request: ${JSON.stringify(emailRequest)}`);

  const response = await resend.emails.send(emailRequest);

  if (response.error) {
    throw new Error(
      `Email failed to send: ${JSON.stringify(response.error)}`,
    );
  }

  return {
    content: [
      {
        type: 'text',
        text: `Email sent successfully! ${JSON.stringify(response.data)}`,
      },
    ],
  };
}