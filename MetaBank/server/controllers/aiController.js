const { chatWithAI, fraudAnalyze } = require('../services/aiService');

exports.chat = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const reply = await chatWithAI(prompt);
    res.json({ ok: true, reply });
  } catch (err) { next(err); }
};

exports.analyze = async (req, res, next) => {
  try {
    const { transactions } = req.body;
    const result = await fraudAnalyze(transactions || []);
    res.json({ ok: true, result });
  } catch (err) { next(err); }
};
