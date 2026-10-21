import fs from 'fs';
import path from 'path';
import https from 'https';
import { INITIAL_STUDENTS } from '../src/data/students.js';

const targetDir = path.resolve('public/audio/lucky');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function fetchAudio(text, retryCount = 0) {
  return new Promise((resolve, reject) => {
    const url = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=' + encodeURIComponent(text);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        if (retryCount < 3) {
          setTimeout(() => {
            fetchAudio(text, retryCount + 1).then(resolve).catch(reject);
          }, 1000);
          return;
        }
        return reject(new Error(`HTTP ${res.statusCode} for text: ${text}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', err => {
      if (retryCount < 3) {
        setTimeout(() => {
          fetchAudio(text, retryCount + 1).then(resolve).catch(reject);
        }, 1000);
        return;
      }
      reject(err);
    });
  });
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log(`Generating lucky announcement audio for ${INITIAL_STUDENTS.length} students...`);
  const mapping = {};

  // 1. General fallback
  const defaultText = 'Chúc mừng bạn đã trúng câu hỏi may mắn, nếu trả lời đúng sẽ được 10 điểm và một phần quà từ giáo viên!';
  try {
    const defaultBuf = await fetchAudio(defaultText);
    const defaultPath = path.join(targetDir, 'lucky-default.mp3');
    fs.writeFileSync(defaultPath, defaultBuf);
    mapping['default'] = `data:audio/mp3;base64,${defaultBuf.toString('base64')}`;
    console.log('Generated lucky-default.mp3');
  } catch (err) {
    console.error('Failed to generate default:', err);
  }
  await delay(150);

  // 2. All 39 students
  for (const s of INITIAL_STUDENTS) {
    const text = `Chúc mừng bạn ${s.name} đã trúng câu hỏi may mắn, nếu trả lời đúng sẽ được 10 điểm và một phần quà từ giáo viên!`;
    const fileName = `lucky-${s.id}.mp3`;
    const filePath = path.join(targetDir, fileName);

    try {
      const buf = await fetchAudio(text);
      fs.writeFileSync(filePath, buf);
      const b64 = `data:audio/mp3;base64,${buf.toString('base64')}`;
      mapping[s.id] = b64;
      mapping[s.name] = b64;
      console.log(`[${s.id}/${INITIAL_STUDENTS.length}] Generated lucky voice for: ${s.name} (${buf.length} bytes)`);
    } catch (err) {
      console.error(`Failed student ${s.name}:`, err.message);
    }
    await delay(120);
  }

  // Write TypeScript file
  const tsContent = `/**
 * Pre-generated 100% Offline Vietnamese voice for Lucky Question Announcement
 * "Chúc mừng bạn [Tên] đã trúng câu hỏi may mắn, nếu trả lời đúng sẽ được 10 điểm và một phần quà từ giáo viên!"
 */

export const LUCKY_VOICE_BASE64: Record<string | number, string> = ${JSON.stringify(mapping, null, 2)};
`;

  fs.writeFileSync(path.resolve('src/data/luckyVoices.ts'), tsContent, 'utf8');
  console.log('Successfully saved src/data/luckyVoices.ts!');
}

run();
