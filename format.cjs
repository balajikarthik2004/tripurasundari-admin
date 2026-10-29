const fs = require('fs');
const arr = require('./temp_extract.cjs');

const formatted = arr.map(t => {
  return `  {
    id: ${JSON.stringify(t.slug)},
    name: ${JSON.stringify(t.name)},
    short: ${JSON.stringify(t.city)},
    weather: "32°C ☀",
    district: ${JSON.stringify(t.district)},
    state: ${JSON.stringify(t.state)},
  },`;
}).join('\n');

const res = `export const TEMPLES = [\n${formatted}\n];`;
fs.writeFileSync('temp_formatted.txt', res);
