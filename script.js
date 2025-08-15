function generateMapping() {
  const chars = [];
  for (let i = 32; i < 127; i++) chars.push(String.fromCharCode(i));
  const shuffled = [...chars].sort(() => Math.random() - 0.5);
  return { map: Object.fromEntries(chars.map((c, i) => [c, shuffled[i]])),
           rev: Object.fromEntries(shuffled.map((c, i) => [c, chars[i]])) };
}

function customEncodeChar(c, mapping) {
  // Step 1: char → binary
  let bin = c.codePointAt(0).toString(2).padStart(16, "0");
  // Step 2: reverse bits
  bin = bin.split("").reverse().join("");
  // Step 3: binary → hex
  let hex = parseInt(bin, 2).toString(16).padStart(4, "0");
  // Step 4: mapping substitution
  hex = hex.split("").map(ch => mapping.map[ch] || ch).join("");
  // Step 5: add random salt (printable ASCII char)
  const salt = String.fromCharCode(33 + Math.floor(Math.random() * 94));
  return salt + hex; // salt + encoded char
}

function customDecodeChar(enc, mapping) {
  // Step 1: remove salt
  const hexPart = enc.slice(1);
  // Step 2: reverse mapping substitution
  let restored = hexPart.split("").map(ch => mapping.rev[ch] || ch).join("");
  // Step 3: hex → binary
  let bin = parseInt(restored, 16).toString(2).padStart(16, "0");
  // Step 4: reverse bits back
  bin = bin.split("").reverse().join("");
  // Step 5: binary → char
  return String.fromCodePoint(parseInt(bin, 2));
}

function encode() {
  const input = document.getElementById("inputText").value;
  if (!input) return;

  const mapping = generateMapping();
  let encoded = input.split("").map(c => customEncodeChar(c, mapping)).join("|");

  // Layer 2: Base64
  encoded = btoa(encoded);

  // Layer 3: noise injection
  const noiseChars = "!@#$%^&*()_+=[]{}|;:,.<>?";
  encoded = encoded.split("").map(ch => ch + noiseChars[Math.floor(Math.random() * noiseChars.length)]).join("");

  // Layer 4: reverse
  encoded = encoded.split("").reverse().join("");

  // Embed mapping in Base64 at start
  const mappingB64 = btoa(JSON.stringify(mapping));
  const finalEncoded = mappingB64 + "::" + encoded;

  document.getElementById("outputText").value = finalEncoded;
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

    // Reverse step 4
    let decoded = data.split("").reverse().join("");

    // Remove noise (every 2nd char)
    decoded = decoded.split("").filter((_, i) => i % 2 === 0).join("");

    // Base64 decode
    decoded = atob(decoded);

    // Decode each chunk (each chunk starts with salt)
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
