function encode() {
  const input = document.getElementById("inputText").value;
  let encoded = "";

  for (const char of input) {
    const hex = char.codePointAt(0).toString(16).padStart(4, "0");
    encoded += `#x${hex}@`;
  }

  const base64 = btoa(encoded);
  document.getElementById("outputText").value = base64;
}

function decode() {
  const input = document.getElementById("decodeInput").value;
  let decoded = "";

  try {
    const raw = atob(input);
    const regex = /#x([0-9a-fA-F]{4})@/g;
    let match;

    while ((match = regex.exec(raw)) !== null) {
      const codePoint = parseInt(match[1], 16);
      decoded += String.fromCodePoint(codePoint);
    }

    document.getElementById("decodeOutput").value = decoded || "[Could not decode]";
  } catch (err) {
    document.getElementById("decodeOutput").value = "[Invalid input]";
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
