const fs = require('fs');
const https = require('https');
const path = require('path');

// Mapping to proper pure Tamil text for the TTS engine
const POOJAS_TAMIL = [
  { name: "Ushathkala Pooja (Dawn)", text: "பக்தர்களின் கனிவான கவனத்திற்கு. காலை 5 30 மணிக்கு நடைபெறும் உஷத்கால பூஜை தற்போது துவங்குகிறது." },
  { name: "Kalasandhi Pooja", text: "பக்தர்களின் கனிவான கவனத்திற்கு. காலை 8 மணிக்கு நடைபெறும் காலசந்தி பூஜை தற்போது துவங்குகிறது." },
  { name: "Uchikala Pooja", text: "பக்தர்களின் கனிவான கவனத்திற்கு. மதியம் 12 மணிக்கு நடைபெறும் உச்சிகால பூஜை தற்போது துவங்குகிறது." },
  { name: "Sayaratchai Pooja (Evening)", text: "பக்தர்களின் கனிவான கவனத்திற்கு. மாலை 5 30 மணிக்கு நடைபெறும் சாயரட்சை பூஜை தற்போது துவங்குகிறது." },
  { name: "Irandam Kala Pooja (Second)", text: "பக்தர்களின் கனிவான கவனத்திற்கு. இரவு 7 30 மணிக்கு நடைபெறும் இரண்டாம் கால பூஜை தற்போது துவங்குகிறது." },
  { name: "Arthajama Pooja (Night)", text: "பக்தர்களின் கனிவான கவனத்திற்கு. இரவு 9 மணிக்கு நடைபெறும் அர்த்தஜாம பூஜை தற்போது துவங்குகிறது." }
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
  console.log('Generating PROPER Tamil voice audio files...');
  for (const p of POOJAS_TAMIL) {
    const filename = path.join(audioDir, `${p.name.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`);
    try {
      await downloadAudio(p.text, filename);
      console.log(`Saved: ${filename}`);
    } catch (e) {
      console.error(`Failed to generate ${filename}`, e);
    }
  }
  console.log('Done!');
}

main();
