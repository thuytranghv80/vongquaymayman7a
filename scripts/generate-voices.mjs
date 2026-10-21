import fs from 'fs';
import path from 'path';
import https from 'https';

const students = [
  { id: 1, name: "Võ Công Bửu Ân" },
  { id: 2, name: "Nguyễn Minh Châu" },
  { id: 3, name: "Võ Thị Quỳnh Chi" },
  { id: 4, name: "Nguyễn Viết Đạt" },
  { id: 5, name: "Nguyễn Ngọc Gia Hân" },
  { id: 6, name: "Nguyễn Thị Ngọc Hân" },
  { id: 7, name: "Võ Thị Ngọc Hân" },
  { id: 8, name: "Trần Ngọc Hiệp" },
  { id: 9, name: "Nguyễn Đăng Huy" },
  { id: 10, name: "Võ Văn Phúc Khang" },
  { id: 11, name: "Nguyễn Thị Minh Khánh" },
  { id: 12, name: "Phan Ngọc Thiên Kim" },
  { id: 13, name: "Mai Thị Khánh Lê" },
  { id: 14, name: "Nguyễn Trần Mai Linh" },
  { id: 15, name: "Lê Văn Lợi" },
  { id: 16, name: "Nguyễn Võ Khánh Ly" },
  { id: 17, name: "Nguyễn Thanh Ngọc Minh" },
  { id: 18, name: "Võ Thị Bảo Ngân" },
  { id: 19, name: "Hồ Thị Vân Ngọc" },
  { id: 20, name: "Hoàng Lê Thảo Nguyên" },
  { id: 21, name: "Võ Nguyễn Nguyên Phong" },
  { id: 22, name: "Nguyễn Trí Bảo Phúc" },
  { id: 23, name: "Nguyễn Lý Anh Phương" },
  { id: 24, name: "Phan Võ Minh Quân" },
  { id: 25, name: "Võ Văn Quy" },
  { id: 26, name: "Nguyễn Viết Quyết" },
  { id: 27, name: "Võ Đình Tài" },
  { id: 28, name: "Nguyễn Đăng Tây" },
  { id: 29, name: "Nguyễn Thị Phương Thanh" },
  { id: 30, name: "Nguyễn Đăng Thắng" },
  { id: 31, name: "Tạ Đức Thịnh" },
  { id: 32, name: "Võ Văn Phúc Thịnh" },
  { id: 33, name: "Võ Văn Phước Thịnh" },
  { id: 34, name: "Võ Thị Kim Thư" },
  { id: 35, name: "Võ Nguyễn Thùy Trang" },
  { id: 36, name: "Nguyễn Hữu Nhật Trung" },
  { id: 37, name: "Võ Thị Minh Tuệ" },
  { id: 38, name: "Nguyễn Thị Thục Uyên" },
  { id: 39, name: "Hoàng Vũ Thảo Vy" }
];

const targetDir = path.resolve('public/audio/students');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function fetchAudio(student) {
  return new Promise((resolve, reject) => {
    const text = `Chúc mừng bạn ${student.name}!`;
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(text)}`;
    const filePath = path.join(targetDir, `student_${student.id}.mp3`);
    
    // Check if already exists and > 5KB
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 5000) {
      const buffer = fs.readFileSync(filePath);
      return resolve({ id: student.id, name: student.name, buffer, base64: buffer.toString('base64') });
    }

    const req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${student.name}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(filePath, buffer);
        console.log(`Saved student ${student.id}: ${student.name} (${buffer.length} bytes)`);
        resolve({ id: student.id, name: student.name, buffer, base64: buffer.toString('base64') });
      });
    });

    req.on('error', reject);
  });
}

async function run() {
  console.log('Generating high-quality Vietnamese TTS audio for all 39 students...');
  const results = [];
  for (const s of students) {
    try {
      const res = await fetchAudio(s);
      results.push(res);
      // Small pause to be gentle
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      console.error('Error fetching student', s.id, err);
    }
  }

  console.log(`Downloaded ${results.length}/${students.length} student audio clips.`);

  // Generate src/data/studentVoices.ts with embedded base64 data URIs so offline single-file HTML has 100% working audio without internet!
  const voiceMap = {};
  for (const r of results) {
    voiceMap[r.id] = `data:audio/mp3;base64,${r.base64}`;
    // Also map by exact name and trimmed name
    voiceMap[r.name] = `data:audio/mp3;base64,${r.base64}`;
    voiceMap[r.name.trim().toLowerCase()] = `data:audio/mp3;base64,${r.base64}`;
  }

  const tsContent = `// Pre-rendered Crystal Clear Vietnamese Voice for all 39 Students of Class 7A1
// Generated using Google Vietnamese High-Fidelity Audio
export const STUDENT_VOICE_BASE64: Record<string | number, string> = ${JSON.stringify(voiceMap, null, 2)};
`;

  fs.writeFileSync(path.resolve('src/data/studentVoices.ts'), tsContent, 'utf-8');
  console.log('Created src/data/studentVoices.ts successfully!');
}

run().catch(console.error);
