// bytesXc Encoder/Decoder with fade animation on output

const prefix = "bx";

function encodeChar(char) {
  const code = char.charCodeAt(0);
  let base36 = code.toString(36).toUpperCase();
  base36 = base36.padStart(4, '0');
  return prefix + base36;
}

function decodeChunk(chunk) {
  if (!chunk.startsWith(prefix)) return '';
  const base36 = chunk.slice(prefix.length);
  const code = parseInt(base36, 36);
  if (isNaN(code)) return '';
  return String.fromCharCode(code);
}

function encodeText(text) {
  let encoded = "";
  for (const ch of text) {
    encoded += encodeChar(ch);
  }
  return encoded;
}

function decodeText(encoded) {
  let decoded = "";
  const chunkLength = prefix.length + 4;
  for (let i = 0; i < encoded.length; i += chunkLength) {
    const chunk = encoded.slice(i, i + chunkLength);
    decoded += decodeChunk(chunk);
  }
  return decoded;
}

// DOM Elements
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
  if (encodedText.length % 6 !== 0) {
    decodeOutput.value = "Invalid encoded string length!";
    return;
  }
  const decoded = decodeText(encodedText);
  decodeOutput.value = decoded;
  animateOutput(decodeOutput);
});
