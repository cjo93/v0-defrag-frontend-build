/**
 * AI Model Configuration — single source of truth.
 *
 * Default: Groq + Llama 3.3 70B (free tier: 30 RPM, 14,400 req/day).
 * Open-source models, independent infrastructure.
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

import { groq } from '@ai-sdk/groq';

/** Primary model — used for the main chat intelligence pipeline. */
export const chatModel = groq(process.env.AI_CHAT_MODEL || 'llama-3.3-70b-versatile');

/** Lightweight model — used for compression and summarisation tasks. */
export const utilityModel = groq(process.env.AI_UTILITY_MODEL || 'llama-3.1-8b-instant');
