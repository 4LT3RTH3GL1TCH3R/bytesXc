const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()-_=+[]{}<>!?~|';

function encode() {
  const input = document.getElementById("inputText").value;
  let encoded = '';

  for (const char of input) {
    const code = char.codePointAt(0);
    const left = charset[Math.floor(Math.random() * charset.length)];
    const right = charset[Math.floor(Math.random() * charset.length)];
    encoded += `${left}${code.toString(16).padStart(4, '0')}${right}`;
  }

  document.getElementById("outputText").value = encoded;
}

function decode() {
  const input = document.getElementById("decodeInput").value;
  let decoded = '';

  for (let i = 0; i < input.length; i += 6) {
    const hex = input.slice(i + 1, i + 5);
    const codePoint = parseInt(hex, 16);
    decoded += String.fromCodePoint(codePoint);
  }

  document.getElementById("decodeOutput").value = decoded;
}

function copyOutput() {
  const output = document.getElementById("outputText");
  if (!output.value) return;

  navigator.clipboard.writeText(output.value).then(() => {
    alert("Encoded text copied!");
  }).catch(() => {
    alert("Copy failed.");
  });
}

function copyDecoded() {
  const output = document.getElementById("decodeOutput");
  if (!output.value) return;

  navigator.clipboard.writeText(output.value).then(() => {
    alert("Decoded text copied!");
  }).catch(() => {
    alert("Copy failed.");
  });
}
