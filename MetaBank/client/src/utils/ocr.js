import { createWorker } from 'tesseract.js';

export async function ocrImage(file, options = {}) {
  const worker = createWorker({ logger: () => {} });
  try {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data } = await worker.recognize(file);
    await worker.terminate();
    return data.text;
  } catch (e) {
    try { await worker.terminate(); } catch (err) {}
    throw e;
  }
}
