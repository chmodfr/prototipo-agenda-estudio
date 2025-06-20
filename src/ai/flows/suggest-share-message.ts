// src/ai/flows/suggest-share-message.ts
'use server';

/**
 * @fileOverview Generates a suggested share message with potential service offerings based on past booking data.
 *
 * - suggestShareMessage - A function that generates a personalized share message for studio owners.
 * - SuggestShareMessageInput - The input type for the suggestShareMessage function.
 * - SuggestShareMessageOutput - The return type for the suggestShareMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestShareMessageInputSchema = z.object({
  studioName: z.string().describe('The name of the studio.'),
  calendarLink: z.string().describe('The link to the studio booking calendar.'),
  clientName: z.string().optional().describe('The name of the client (optional).'),
  pastBookingData: z
    .string()
    .optional()
    .describe('Past booking data for the client (optional).'),
});
export type SuggestShareMessageInput = z.infer<typeof SuggestShareMessageInputSchema>;

const SuggestShareMessageOutputSchema = z.object({
  message: z.string().describe('The suggested share message.'),
});
export type SuggestShareMessageOutput = z.infer<typeof SuggestShareMessageOutputSchema>;

export async function suggestShareMessage(input: SuggestShareMessageInput): Promise<SuggestShareMessageOutput> {
  return suggestShareMessageFlow(input);
}

const suggestShareMessagePrompt = ai.definePrompt({
  name: 'suggestShareMessagePrompt',
  input: {schema: SuggestShareMessageInputSchema},
  output: {schema: SuggestShareMessageOutputSchema},
  prompt: `You are an AI assistant helping studio owners generate share messages for their availability calendar.

  The studio name is: {{{studioName}}}
  The calendar link is: {{{calendarLink}}}

  {{#if clientName}}
  You have the following information about the client: {{{clientName}}}
  {{/if}}

  {{#if pastBookingData}}
  You have the following past booking data for the client: {{{pastBookingData}}}
  Based on this data, suggest potential service offerings that might be of interest to the client.
  {{/if}}

  Generate a short, friendly message that the studio owner can copy and paste to share the availability calendar.
  If possible, incorporate potential service offerings based on the past booking data to encourage bookings.
  Make it conversational and engaging.
  Make sure to include the studio name and calendar link.
  Keep the message under 200 characters.
  `,
});

const suggestShareMessageFlow = ai.defineFlow(
  {
    name: 'suggestShareMessageFlow',
    inputSchema: SuggestShareMessageInputSchema,
    outputSchema: SuggestShareMessageOutputSchema,
  },
  async input => {
    const {output} = await suggestShareMessagePrompt(input);
    return output!;
  }
);
