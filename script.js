// bytesXc heavy noisy encoder/decoder with full UTF-16 Unicode support

const chunkLength = 102; // 4 hex chars + 98 noise chars
const noiseLength = chunkLength - 4;
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';

function getRandomChar() {
  return charset[Math.floor(Math.random() * charset.length)];
}

function toHex(code) {
  return code.toString(16).padStart(4, '0'); // 4 hex digits for UTF-16 code unit
}

function fromHex(hex) {
  return parseInt(hex, 16);
}

function encodeText(text) {
  let encoded = '';
  for (let i = 0; i < text.length; i++) {
    const codeUnit = text.charCodeAt(i);
    const codeHex = toHex(codeUnit);
    let noise = '';
    for (let j = 0; j < noiseLength; j++) {
      noise += getRandomChar();
    }
    encoded += codeHex + noise;
  }
  return encoded;
}

function decodeText(encoded) {
  if (encoded.length % chunkLength !== 0) {
    return 'Invalid encoded string length!';
  }
  const codeUnits = [];
  for (let i = 0; i < encoded.length; i += chunkLength) {
    const chunk = encoded.slice(i, i + chunkLength);
    const codeHex = chunk.slice(0, 4);
    const codeUnit = fromHex(codeHex);
    codeUnits.push(codeUnit);
  }
  return String.fromCharCode(...codeUnits);
}

// DOM elements
const encodeInput = document.getElementById('encodeInput');
const encodeOutput = document.getElementById('encodeOutput');
const decodeInput = document.getElementById('decodeInput');
const decodeOutput = document.getElementById('decodeOutput');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');

function animateOutput(elem) {
  elem.style.opacity = '0';
  setTimeout(() => {
    elem.style.opacity = '0.95';
  }, 20);
}

encodeBtn.addEventListener('click', () => {
  const inputText = encodeInput.value;
  if (!inputText) {
    encodeOutput.value = '';
    decodeInput.value = '';
    decodeOutput.value = '';
    return;
  }
  const encoded = encodeText(inputText);
  encodeOutput.value = encoded;
  animateOutput(encodeOutput);

  decodeInput.value = encoded;
  decodeOutput.value = '';
});

decodeBtn.addEventListener('click', () => {
  const encodedText = decodeInput.value.trim();
  if (!encodedText) {
    decodeOutput.value = '';
    return;
  }
  const decoded = decodeText(encodedText);
  decodeOutput.value = decoded;
  animateOutput(decodeOutput);
});
