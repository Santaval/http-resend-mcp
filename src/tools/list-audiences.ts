import { z } from "zod";
import { type InferSchema } from "xmcp";
import { Resend } from "resend";

// Get API key from environment variable
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error(
    'No API key provided. Please set RESEND_API_KEY environment variable'
  );
}

const resend = apiKey ? new Resend(apiKey) : null;

// Define the schema for tool parameters (no parameters needed for this tool)
export const schema = {};

// Define tool metadata
export const metadata = {
  name: "list-audiences",
  description: "List all audiences from Resend",
  annotations: {
    title: "List Resend Audiences",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

// Tool implementation
export default async function listAudiences(params: InferSchema<typeof schema>) {
  if (!resend) {
    throw new Error('Resend API key not configured. Please set RESEND_API_KEY environment variable.');
  }

  const response = await resend.audiences.list();

  if (response.error) {
    throw new Error(
      `Failed to list audiences: ${JSON.stringify(response.error)}`,
    );
  }

  return {
    content: [
      {
        type: 'text',
        text: `Audiences: ${JSON.stringify(response.data, null, 2)}`,
      },
    ],
  };
}