const fs = require('fs');
const https = require('https');
const path = require('path');

const POOJAS = [
  { time: "5:30 AM", name: "Ushathkala Pooja (Dawn)" },
  { time: "8:00 AM", name: "Kalasandhi Pooja" },
  { time: "12:00 PM", name: "Uchikala Pooja" },
  { time: "5:30 PM", name: "Sayaratchai Pooja (Evening)" },
  { time: "7:30 PM", name: "Irandam Kala Pooja (Second)" },
  { time: "9:00 PM", name: "Arthajama Pooja (Night)" }
];

const audioDir = path.join(__dirname, 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

function downloadAudio(text, filename) {
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=ta&q=${encodeURIComponent(text)}`;
    const file = fs.createWriteStream(filename);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Generating Tamil voice audio files...');
  for (const p of POOJAS) {
    const text = `பக்தர்களின் கனிவான கவனத்திற்கு. ${p.time} மணிக்கு நடைபெறும் ${p.name} தற்போது துவங்குகிறது.`;
    const filename = path.join(audioDir, `${p.name.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`);
    try {
      await downloadAudio(text, filename);
      console.log(`Saved: ${filename}`);
    } catch (e) {
      console.error(`Failed to generate ${filename}`, e);
    }
  }
  console.log('Done!');
}

main();
