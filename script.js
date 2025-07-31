// bytesXc super-heavy noisy encoder/decoder
// Each char encoded as 100 chars: first 2 hex chars encode char code, rest 98 random noise chars

const chunkLength = 100;
const noiseLength = chunkLength - 2;
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';

function getRandomChar() {
  return charset[Math.floor(Math.random() * charset.length)];
}

function toHex(code) {
  return code.toString(16).padStart(2, '0');
}

function fromHex(hex) {
  return parseInt(hex, 16);
}

function encodeText(text) {
  let encoded = '';
  for (let ch of text) {
    const codeHex = toHex(ch.charCodeAt(0));
    let noise = '';
    for (let i = 0; i < noiseLength; i++) {
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
  let decoded = '';
  for (let i = 0; i < encoded.length; i += chunkLength) {
    const chunk = encoded.slice(i, i + chunkLength);
    const codeHex = chunk.slice(0, 2);
    const charCode = fromHex(codeHex);
    decoded += String.fromCharCode(charCode);
  }
  return decoded;
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
