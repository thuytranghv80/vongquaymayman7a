import fs from 'fs';
import path from 'path';
import https from 'https';
import { QUESTIONS_BANK } from '../src/data/questions.js';

const targetDir = path.resolve('public/audio/questions');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function fetchPart(text, retries = 3) {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(text)}`;
    const req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        if (retries > 0) {
          setTimeout(() => {
            fetchPart(text, retries - 1).then(resolve).catch(reject);
          }, 500);
          return;
        }
        return reject(new Error(`Status ${res.statusCode} for "${text.slice(0, 30)}..."`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => {
          fetchPart(text, retries - 1).then(resolve).catch(reject);
        }, 500);
        return;
      }
      reject(err);
    });
  });
}

async function fetchFullQuestionAudio(q) {
  const filePath = path.join(targetDir, `question_${q.id}.mp3`);

  const parts = [
    `Câu ${q.id}: ${q.question}`,
    `A: ${q.options.A}`,
    `B: ${q.options.B}`,
    `C: ${q.options.C}`,
    `D: ${q.options.D}`,
  ];

  const buffers = [];
  for (const part of parts) {
    const buf = await fetchPart(part);
    buffers.push(buf);
    await new Promise(r => setTimeout(r, 60)); // Polite throttle
  }

  const combined = Buffer.concat(buffers);
  fs.writeFileSync(filePath, combined);
  console.log(`Saved Question ${q.id} with 4 options (${combined.length} bytes): "Câu ${q.id}: ${q.question.slice(0, 30)}..."`);
  return { id: q.id, buffer: combined, base64: combined.toString('base64') };
}

async function run() {
  console.log(`Generating audio (Question + 4 Options A, B, C, D) for all ${QUESTIONS_BANK.length} questions...`);
  const results = [];

  for (let i = 0; i < QUESTIONS_BANK.length; i++) {
    const q = QUESTIONS_BANK[i];
    try {
      const res = await fetchFullQuestionAudio(q);
      results.push(res);
      console.log(`Progress: ${results.length}/${QUESTIONS_BANK.length}`);
    } catch (err) {
      console.error(`Error processing Question ${q.id}:`, err);
    }
  }

  console.log(`Completed fetching ${results.length}/${QUESTIONS_BANK.length} questions.`);

  const voiceMap = {};
  for (const r of results) {
    voiceMap[r.id] = `data:audio/mp3;base64,${r.base64}`;
  }

  const tsContent = `// Pre-rendered Crystal Clear Vietnamese Voice for all 28 Questions & 4 Options of Bài 4: Giữ chữ tín
// Generated using Google Vietnamese High-Fidelity Audio
export const QUESTION_VOICE_BASE64: Record<number, string> = ${JSON.stringify(voiceMap, null, 2)};
`;

  fs.writeFileSync(path.resolve('src/data/questionVoices.ts'), tsContent, 'utf-8');
  console.log('Created src/data/questionVoices.ts successfully with questions and all 4 options!');
}

run().catch(console.error);
