const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.chatWithAI = async (prompt) => {
  if (!process.env.OPENAI_API_KEY) return { reply: 'AI API not configured' };
  // Use the new client interface: openai.chat.completions.create
  const res = await openai.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 500 });
  // Support multiple response shapes
  const reply = res?.choices?.[0]?.message?.content || res?.choices?.[0]?.message || res?.output?.[0]?.content || '';
  return { reply };
};

exports.simulateCreditScore = async ({ userId, wallet, amount }) => {
  // Simple heuristic simulation for credit scoring
  const score = Math.random();
  return score;
};

exports.fraudAnalyze = async (transactions) => {
  // Basic heuristic: flag if transfer > threshold or many txs in short time
  const alerts = [];
  const largeThreshold = 10000;
  transactions.forEach(tx => {
    if (tx.amount > largeThreshold) alerts.push({ tx, reason: 'large transfer' });
  });
  return { alerts };
};
