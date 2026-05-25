const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider(process.env.LOCAL_RPC_URL || 'http://127.0.0.1:8545');

exports.getLatestBlocks = async (req, res, next) => {
  try {
    const blockNumber = await provider.getBlockNumber();
    const blocks = [];
    const count = Math.min(blockNumber + 1, 5); // get last 5 blocks
    for (let i = 0; i < count; i++) {
      const block = await provider.getBlock(blockNumber - i);
      if (block) {
        blocks.push({
          number: block.number,
          hash: block.hash,
          timestamp: block.timestamp,
          transactionsCount: block.transactions ? block.transactions.length : 0
        });
      }
    }
    res.json({ ok: true, blocks });
  } catch (err) { next(err); }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const { hash } = req.params;
    const tx = await provider.getTransaction(hash);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    const receipt = await provider.getTransactionReceipt(hash);
    res.json({ ok: true, tx, receipt });
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const blockNumber = await provider.getBlockNumber();
    const network = await provider.getNetwork();
    let feeData = { gasPrice: null };
    try {
      feeData = await provider.getFeeData();
    } catch (e) {
      // ignore
    }
    res.json({
      ok: true,
      blockNumber,
      networkName: network.name || network.chainId.toString(),
      gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0'
    });
  } catch (err) { next(err); }
};
