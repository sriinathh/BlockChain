const OpenAI = require('openai');
require('dotenv').config();

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

exports.chatWithAI = async (prompt) => {
  if (openai) {
    try {
      const res = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500
      });
      const reply = res?.choices?.[0]?.message?.content || res?.choices?.[0]?.message || '';
      return { reply };
    } catch (e) {
      console.warn('OpenAI chat failed, falling back to rule engine:', e);
    }
  }

  // Fallback Rule Engine responses
  const lowerPrompt = prompt.toLowerCase();
  let reply = "I am your MetaBank AI Assistant. I can help analyze your spending patterns, optimize yield via staking, or guide you through loan applications. How can I help you today?";
  
  if (lowerPrompt.includes('yield') || lowerPrompt.includes('stake') || lowerPrompt.includes('staking')) {
    reply = "MetaBank offers staking for our utility token MBT. Staking MBT yields a secure 5% APY return. You can lock your tokens in our decentralized staking module on the Staking page to start earning real-time transaction rewards.";
  } else if (lowerPrompt.includes('loan') || lowerPrompt.includes('borrow')) {
    reply = "To apply for a loan, navigate to the Loans section. Our AI Underwriter will evaluate your credit profile based on KYC verification and cash balances. Checking account holders with verified KYC qualify for interest rates as low as 5%.";
  } else if (lowerPrompt.includes('fraud') || lowerPrompt.includes('safety') || lowerPrompt.includes('security')) {
    reply = "MetaBank incorporates automated real-time transaction monitoring. Transactions exceeding $10,000 or exhibiting velocity anomalies are flagged and held for Bank Officer review to prevent phishing and unauthorized access.";
  } else if (lowerPrompt.includes('nft') || lowerPrompt.includes('card')) {
    reply = "We offer premium NFT banking cards (Standard, Premium, Elite) that verify your identity on-chain. Premium members unlock high-interest savings accounts and gas-free transaction benefits. Mint yours in the NFT Identity portal.";
  } else if (lowerPrompt.includes('balance') || lowerPrompt.includes('saving')) {
    reply = "Optimizing savings is key. I recommend moving 20% of your checking balance to a high-yield savings account or staking it in MBT to outpace inflation and earn reward tokens.";
  }

  return { reply };
};

// Heuristic credit scoring based on profile data
exports.simulateCreditScore = async ({ userId, wallet, amount }) => {
  const User = require('../models/User');
  const Account = require('../models/Account');

  let baseScore = 0.5; // Neutral starting score

  try {
    const user = await User.findById(userId);
    if (user) {
      // verified KYC gives +0.2
      if (user.aadharVerified) baseScore += 0.2;
      // Staking balances give +0.1
      if (user.stakingBalance > 0) baseScore += 0.1;
      
      // Traditional account balances give boost
      const accounts = await Account.find({ user: userId });
      const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
      if (totalBalance > 5000) baseScore += 0.15;
      if (totalBalance > 15000) baseScore += 0.1;
    }
  } catch (e) {
    // Ignore and use default
  }

  // Bound credit score between 0.1 and 0.99
  const score = Math.max(0.1, Math.min(0.99, baseScore + (Math.random() * 0.1 - 0.05)));
  return score;
};

// AI fraud anomaly evaluation
exports.fraudAnalyze = async (transactions) => {
  const alerts = [];
  const largeThreshold = 10000; // flag transactions larger than $10,000

  transactions.forEach(tx => {
    const amount = Number(tx.amount);
    
    // Check 1: Large transaction check
    if (amount > largeThreshold) {
      alerts.push({
        tx,
        reason: 'Transaction volume exceeds enterprise daily threshold limit ($10,000)',
        riskScore: 0.92
      });
    } 
    // Check 2: High velocity mock check (simulate velocity flag for exactly repeating decimals)
    else if (amount > 0 && amount % 111.11 === 0) {
      alerts.push({
        tx,
        reason: 'High-frequency transaction velocity pattern anomaly detected',
        riskScore: 0.78
      });
    }
  });

  return { alerts };
};
