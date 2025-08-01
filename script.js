const ENCODE_MAP = {};
for (let i = 0; i < 256; i++) {
  let char = String.fromCharCode(i);
  let enc = '';
  for (let j = 0; j < 40; j++) {
    enc += String.fromCharCode(33 + ((i * j + j) % 94)); // noisy mapping
  }
  ENCODE_MAP[char] = enc;
}

function injectNoise(encoded) {
  const junk = "!@#$%^&*()_+-=[]{};:,./<>?|~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let output = '';
  for (let char of encoded) {
    output += char;
    for (let i = 0; i < 8; i++) {
      output += junk[Math.floor(Math.random() * junk.length)];
    }
  }
  return output;
}

function cleanNoise(input) {
  return input.split('').filter((_, i) => i % 9 === 0).join('');
}

function encode() {
  let input = document.getElementById("inputText").value;
  let encoded = "";
  for (let c of input) {
    encoded += ENCODE_MAP[c] || "?".repeat(40);
  }
  encoded = injectNoise(encoded);
  document.getElementById("outputText").value = encoded;
}

function decode() {
  try {
    let input = cleanNoise(document.getElementById("outputText").value);
    if (input.length % 40 !== 0) throw new Error("Invalid encoded string length!");
    let chunks = input.match(/.{1,40}/g);
    let decoded = "";
    for (let chunk of chunks) {
      let match = Object.entries(ENCODE_MAP).find(([k, v]) => v === chunk);
      decoded += match ? match[0] : "?";
    }
    document.getElementById("inputText").value = decoded;
  } catch (err) {
    alert(err.message);
  }
}

function copyOutput() {
  navigator.clipboard.writeText(document.getElementById("outputText").value);
}

function copyRunner() {
  navigator.clipboard.writeText(document.getElementById("runnerOutput").value);
}

function toggleTool(id) {
  document.querySelectorAll(".tool").forEach(tool => tool.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "m") {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");
    if (sidebar.style.transform === "translateX(-100%)") {
      sidebar.style.transform = "translateX(0)";
      main.style.marginLeft = "200px";
    } else {
      sidebar.style.transform = "translateX(-100%)";
      main.style.marginLeft = "0";
    }
  }
});

// Python Obfuscator
function obfuscatePython() {
  const script = document.getElementById("pythonInput").value;
  let encoded = "";
  for (let c of script) {
    encoded += ENCODE_MAP[c] || "?".repeat(40);
  }
  encoded = injectNoise(encoded);

  const runner = `
import time
import sys

def clean_noise(s):
    return ''.join([s[i] for i in range(0, len(s), 9)])

def decode_bytesxc(raw):
    ENC_MAP = {}
    for i in range(256):
        c = chr(i)
        encoded = ''.join([chr(33 + ((i * j + j) % 94)) for j in range(40)])
        ENC_MAP[encoded] = c
    raw = clean_noise(raw)
    chunks = [raw[i:i+40] for i in range(0, len(raw), 40)]
    return ''.join([ENC_MAP.get(chunk, '?') for chunk in chunks])

obfuscated = """${encoded}"""
exec(decode_bytesxc(obfuscated))
`;

  document.getElementById("runnerOutput").value = runner.trim();
}
