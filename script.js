const junkSet = '!@#$%^&*()-=_+[]{}<>~|/?.:,;abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function obfuscateChar(char) {
  let code = char.codePointAt(0).toString(16).padStart(4, '0');
  let junkBefore = randomJunk(2);
  let junkAfter = randomJunk(2);
  return `${junkBefore}${code}${junkAfter}`;
}

function randomJunk(length) {
  let junk = '';
  for (let i = 0; i < length; i++) {
    junk += junkSet[Math.floor(Math.random() * junkSet.length)];
  }
  return junk;
}

function shuffleString(str) {
  return str.split('').sort(() => 0.5 - Math.random()).join('');
}

function encode() {
  const input = document.getElementById("inputText").value;
  let encodedBlocks = [];

  for (const char of input) {
    encodedBlocks.push(obfuscateChar(char));
  }

  const final = shuffleString(encodedBlocks.join(''));
  const base64 = btoa(final);

  document.getElementById("outputText").value = base64;
}

function decode() {
  const input = document.getElementById("decodeInput").value;
  let decoded = '';

  try {
    const raw = atob(input);
    for (let i = 0; i < raw.length - 7; i++) {
      const segment = raw.slice(i, i + 8);
      const hexMatch = segment.match(/[a-f0-9]{4}/i);
      if (hexMatch) {
        const codePoint = parseInt(hexMatch[0], 16);
        decoded += String.fromCodePoint(codePoint);
        i += 7; // Skip over the 8-character chunk
      }
    }
    document.getElementById("decodeOutput").value = decoded || '[Unable to decode]';
  } catch (e) {
    document.getElementById("decodeOutput").value = '[Invalid encoded input]';
  }
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
