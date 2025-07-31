// bytesXc v2 X25 - Complex multi-layer encoding/decoding with fixed XOR key, noise, random chunks, and deterministic shuffle/unshuffle

// Constants
const xorKey = 0x5A; // fixed XOR key

const delimiter = '-';

// PRNG with seed for deterministic shuffle/unshuffle
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// Fixed seed for shuffle/unshuffle
const fixedSeed = 0xdeadbeef;
const rand = mulberry32(fixedSeed);

// Utility - random char from allowed charset
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
function getRandomChar() {
  return charset[Math.floor(rand() * charset.length)];
}

// XOR encode char code
function xorCharCode(code) {
  return code ^ xorKey;
}

// Encode single char code as hex string (2 chars)
function toHex(code) {
  return code.toString(16).padStart(2, '0');
}

// Decode hex string to number
function fromHex(hex) {
  return parseInt(hex, 16);
}

// Step 1: Encode text to chunks
function encodeText(text) {
  // Reset PRNG for encoding shuffle and noise generation
  const rng = mulberry32(fixedSeed);

  // XOR and convert to chunks with random length 3-6
  let chunks = [];
  for (let ch of text) {
    const xorCode = xorCharCode(ch.charCodeAt(0));
    const chunkLen = 3 + Math.floor(rng() * 4); // 3-6 chars length

    // Encode first two chars as hex of xorCode
    // Remaining chars are random noise
    let chunk = toHex(xorCode);
    for (let i = 2; i < chunkLen; i++) {
      chunk += getRandomChar();
    }
    chunks.push(chunk);
  }

  // Step 2: Add noise chunks (50% of total chunks)
  const noiseCount = Math.floor(chunks.length * 0.5);
  for (let i = 0; i < noiseCount; i++) {
    const noiseLen = 4 + Math.floor(rng() * 5); // 4-8 chars noise chunk
    let noiseChunk = '';
    for (let j = 0; j < noiseLen; j++) {
      noiseChunk += getRandomChar();
    }
    // Insert noise chunk randomly
    const pos = Math.floor(rng() * (chunks.length + 1));
    chunks.splice(pos, 0, noiseChunk);
  }

  // Step 3: Shuffle chunks deterministically with fixed seed
  for (let i = chunks.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [chunks[i], chunks[j]] = [chunks[j], chunks[i]];
  }

  // Step 4: Join with delimiter
  return chunks.join(delimiter);
}

// Step 1 decode: split string to chunks by delimiter
function decodeText(encoded) {
  const rng = mulberry32(fixedSeed);

  let chunks = encoded.split(delimiter);

  // Step 2: Unshuffle chunks deterministically (reverse shuffle)
  // We generate shuffle indices and reverse map

  // Generate shuffle order used in encoding
  let order = [...Array(chunks.length).keys()];
  for (let i = chunks.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  // Build inverse mapping (index in shuffled array -> index in original)
  let inverseOrder = [];
  for (let i = 0; i < order.length; i++) {
    inverseOrder[order[i]] = i;
  }

  // Unshuffle chunks to original order
  let unshuffled = [];
  for (let i = 0; i < chunks.length; i++) {
    unshuffled[inverseOrder[i]] = chunks[i];
  }

  // Step 3: Filter only valid chunks (first two chars hex = xorCode)
  // Valid chunks start with 2 hex chars [0-9a-f]
  const hexRegex = /^[0-9a-fA-F]{2}/;

  let decodedChars = [];

  for (let chunk of unshuffled) {
    if (chunk.length < 2) continue;
    const maybeHex = chunk.slice(0,2);
    if (hexRegex.test(maybeHex)) {
      // decode xorCode and xor back
      const xorCode = fromHex(maybeHex);
      const origCode = xorCode ^ xorKey;
      decodedChars.push(String.fromCharCode(origCode));
    }
    // else noise chunk, skip
  }

  return decodedChars.join('');
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
