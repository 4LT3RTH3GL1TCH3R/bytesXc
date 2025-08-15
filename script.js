function generateMapping() {
  const chars = [];
  for (let i = 32; i < 127; i++) chars.push(String.fromCharCode(i));
  const shuffled = [...chars].sort(() => Math.random() - 0.5);
  return { map: Object.fromEntries(chars.map((c, i) => [c, shuffled[i]])),
           rev: Object.fromEntries(shuffled.map((c, i) => [c, chars[i]])) };
}

function customEncodeChar(c, mapping) {
  // Char → binary → reverse bits → hex
  let bin = c.codePointAt(0).toString(2).padStart(16, "0");
  bin = bin.split("").reverse().join("");
  let hex = parseInt(bin, 2).toString(16).padStart(4, "0");

  // Apply mapping substitution
  hex = hex.split("").map(ch => mapping.map[ch] || ch).join("");

  // Add per-character salt
  const salt = String.fromCharCode(33 + Math.floor(Math.random() * 94));
  return salt + hex;
}

function customDecodeChar(enc, mapping) {
  // Remove salt
  const hexPart = enc.slice(1);

  // Reverse mapping substitution
  let restored = hexPart.split("").map(ch => mapping.rev[ch] || ch).join("");

  // Hex → binary → reverse bits back → char
  let bin = parseInt(restored, 16).toString(2).padStart(16, "0");
  bin = bin.split("").reverse().join("");
  return String.fromCodePoint(parseInt(bin, 2));
}

function encode() {
  const input = document.getElementById("inputText").value;
  if (!input) return;

  // Always generate new mapping for every encode
  const mapping = generateMapping();

  // Encode chars with salt
  let encoded = input.split("").map(c => customEncodeChar(c, mapping)).join("|");

  // Base64
  encoded = btoa(encoded);

  // Random noise injection
  const noiseChars = "!@#$%^&*()_+=[]{}|;:,.<>?";
  encoded = encoded.split("").map(ch => ch + noiseChars[Math.floor(Math.random() * noiseChars.length)]).join("");

  // Reverse
  encoded = encoded.split("").reverse().join("");

  // Store mapping inside final output
  const mappingB64 = btoa(JSON.stringify(mapping));
  document.getElementById("outputText").value = mappingB64 + "::" + encoded;
}

function decode() {
  const input = document.getElementById("decodeInput").value;
  if (!input || !input.includes("::")) {
    document.getElementById("decodeOutput").value = "[Invalid input]";
    return;
  }

  try {
    const [mappingB64, data] = input.split("::");
    const mapping = JSON.parse(atob(mappingB64));

    // Reverse
    let decoded = data.split("").reverse().join("");

    // Remove noise
    decoded = decoded.split("").filter((_, i) => i % 2 === 0).join("");

    // Base64 decode
    decoded = atob(decoded);

    // Decode each chunk
    decoded = decoded.split("|").map(chunk => customDecodeChar(chunk, mapping)).join("");

    document.getElementById("decodeOutput").value = decoded || "[Could not decode]";
  } catch {
    document.getElementById("decodeOutput").value = "[Invalid input or mapping]";
  }
}

function copyOutput() {
  const output = document.getElementById("outputText");
  if (!output.value) return;
  navigator.clipboard.writeText(output.value).then(() => alert("Encoded text copied!"));
}

function copyDecoded() {
  const output = document.getElementById("decodeOutput");
  if (!output.value) return;
  navigator.clipboard.writeText(output.value).then(() => alert("Decoded text copied!"));
}
