/**
 * AI Model Configuration — single source of truth.
 *
 * Default: Google Gemini 2.0 Flash (free tier: 15 RPM, 1M tokens/day).
 * Override via env vars: AI_CHAT_MODEL, AI_UTILITY_MODEL.
 *
 * To switch providers later, install the provider package and change
 * the import below. See: https://sdk.vercel.ai/providers
 *
 * Examples:
 *   import { openai } from '@ai-sdk/openai';
 *   export const chatModel = openai('gpt-4.1');
 *
 *   import { anthropic } from '@ai-sdk/anthropic';
 *   export const chatModel = anthropic('claude-sonnet-4-20250514');
 */

import { google } from '@ai-sdk/google';

/** Primary model — used for the main chat intelligence pipeline. */
export const chatModel = google(process.env.AI_CHAT_MODEL || 'gemini-2.0-flash');

/** Lightweight model — used for compression and summarisation tasks. */
export const utilityModel = google(process.env.AI_UTILITY_MODEL || 'gemini-2.0-flash');
