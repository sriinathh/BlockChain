const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generatePassbookPDF = (transactions, outPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outPath);
    doc.pipe(stream);
    doc.fontSize(14).text('MetaBank - Passbook', { align: 'center' });
    doc.moveDown();
    transactions.forEach(tx => {
      doc.fontSize(10).text(`${tx.timestamp.toISOString()} - ${tx.sender || 'SYSTEM'} -> ${tx.receiver || 'SYSTEM'} : ${tx.amount} ${tx.tokenType}`);
    });
    doc.end();
    stream.on('finish', () => resolve(outPath));
    stream.on('error', reject);
  });
};

exports.exportCSV = (transactions) => {
  const header = 'timestamp,sender,receiver,amount,tokenType,txHash\n';
  const rows = transactions.map(t => `${t.timestamp.toISOString()},${t.sender||''},${t.receiver||''},${t.amount},${t.tokenType},${t.txHash||''}`).join('\n');
  return header + rows;
};
