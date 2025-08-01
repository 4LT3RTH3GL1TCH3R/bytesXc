const charMap = {};
const reverseMap = {};
const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+[]{}|;:',.<>?/`~";
let chunkSize = 10;

for (let i = 0; i < 256; i++) {
  let char = String.fromCharCode(i);
  let noise = "";
  for (let j = 0; j < chunkSize; j++) {
    noise += charset[Math.floor(Math.random() * charset.length)];
  }
  charMap[char] = noise;
  reverseMap[noise] = char;
}

function encode() {
  let input = document.getElementById("input").value;
  let result = "";
  for (let char of input) {
    if (charMap[char]) {
      result += charMap[char];
    } else {
      result += "??????????";
    }
  }
  document.getElementById("output").value = result;
}

function decode() {
  let input = document.getElementById("output").value;
  if (input.length % chunkSize !== 0) {
    alert("Invalid encoded string length!");
    return;
  }
  let result = "";
  for (let i = 0; i < input.length; i += chunkSize) {
    let chunk = input.slice(i, i + chunkSize);
    result += reverseMap[chunk] || "?";
  }
  document.getElementById("input").value = result;
}

function copyOutput() {
  navigator.clipboard.writeText(document.getElementById("output").value);
}

function copyPyOutput() {
  navigator.clipboard.writeText(document.getElementById("pyOutput").value);
}

function switchTool(tool) {
  document.getElementById("mainTool").classList.add("hidden");
  document.getElementById("pyobfuscatorTool").classList.add("hidden");
  document.getElementById(tool + "Tool").classList.remove("hidden");
}

function obfuscatePython() {
  const script = document.getElementById("pyInput").value;
  const base64Script = btoa(unescape(encodeURIComponent(script)));
  const runner = `import base64\nexec(base64.b64decode("${base64Script}").decode())`;
  document.getElementById("pyOutput").value = runner;
}

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "m") {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.transform = sidebar.style.transform === "translateX(-100%)" ? "translateX(0)" : "translateX(-100%)";
  }
});
