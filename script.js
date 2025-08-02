const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()-_=+[]{}<>!?~|';

// Encodes each char with a 3-part randomized symbol wrap + unicode value
function encode() {
  const input = document.getElementById("inputText").value;
  let encoded = '';

  for (const char of input) {
    const code = char.codePointAt(0);
    const obf = [
      charset[Math.floor(Math.random() * charset.length)],
      code.toString(16).padStart(4, '0'),
      charset[Math.floor(Math.random() * charset.length)]
    ];
    const wrap = `${obf[0]}${obf[1]}${obf[2]}`;
    encoded += wrap;
  }

  document.getElementById("outputText").value = encoded;
}

// Decodes the obfuscated format
function decode() {
  const input = document.getElementById("outputText").value;
  let decoded = '';

  for (let i = 0; i < input.length; i += 6) {
    const hex = input.slice(i + 1, i + 5);
    const codePoint = parseInt(hex, 16);
    decoded += String.fromCodePoint(codePoint);
  }

  document.getElementById("inputText").value = decoded;
}
