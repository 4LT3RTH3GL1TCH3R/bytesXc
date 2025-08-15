// Utilities
function shuffleArray(array) { return array.sort(()=>Math.random()-0.5); }
function randomChar(){ const chars="!@#$%^&*()_+=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; return chars[Math.floor(Math.random()*chars.length)]; }

// Standard encoders
const standardEncoders = {
  binary: s=>s.split("").map(c=>c.codePointAt(0).toString(2).padStart(8,"0")).join(" "),
  binaryDecode: s=>s.split(" ").map(b=>String.fromCharCode(parseInt(b,2))).join(""),
  hex: s=>Array.from(s).map(c=>c.charCodeAt(0).toString(16).padStart(2,"0")).join(""),
  hexDecode: s=>s.match(/.{1,2}/g).map(h=>String.fromCharCode(parseInt(h,16))).join(""),
  base64: s=>btoa(s),
  base64Decode: s=>atob(s),
  url: s=>encodeURIComponent(s),
  urlDecode: s=>decodeURIComponent(s),
  rot13: s=>s.replace(/[a-zA-Z]/g,c=>String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26))),
  rot13Decode: s=>standardEncoders.rot13(s),
  asciiDec: s=>Array.from(s).map(c=>c.charCodeAt(0)).join(","),
  asciiDecDecode: s=>s.split(",").map(n=>String.fromCharCode(n)).join(""),
  htmlEntities: s=>Array.from(s).map(c=>"&#"+c.charCodeAt(0)+";").join(""),
  htmlEntitiesDecode: s=>s.replace(/&#(\d+);/g,(m,n)=>String.fromCharCode(n)),
};

// Custom encoding
function generateMapping(){
  const chars=[];
  for(let i=32;i<127;i++)chars.push(String.fromCharCode(i));
  const shuffled=[...chars].sort(()=>Math.random()-0.5);
  return { map:Object.fromEntries(chars.map((c,i)=>[c,shuffled[i]])), rev:Object.fromEntries(shuffled.map((c,i)=>[c,chars[i]])) };
}

function customEncodeChar(c,mapping){
  let bin=c.codePointAt(0).toString(2).padStart(16,"0");
  bin=bin.split("").reverse().join("");
  let hex=parseInt(bin,2).toString(16).padStart(4,"0");
  hex=hex.split("").map(ch=>mapping.map[ch]||ch).join("");
  return randomChar()+hex;
}

function customDecodeChar(enc,mapping){
  const hexPart=enc.slice(1);
  const restored=hexPart.split("").map(ch=>mapping.rev[ch]||ch).join("");
  let bin=parseInt(restored,16).toString(2).padStart(16,"0");
  bin=bin.split("").reverse().join("");
  return String.fromCodePoint(parseInt(bin,2));
}

// Recursive encoding
function recursiveCustomEncode(s,depth=3){
  if(depth===0)return s;
  const mapping=generateMapping();
  const encoded=Array.from(s).map(c=>customEncodeChar(c,mapping)).join("|");
  const noise=Array.from(encoded).map(ch=>ch+randomChar()).join("");
  const marker=String(noise.length).padStart(5,"0"); // 5-digit length marker
  return marker+"~"+btoa(JSON.stringify(mapping))+noise;
}

function recursiveCustomDecode(chunk){
  try{
    const markerLength=parseInt(chunk.slice(0,5));
    const separatorIndex=chunk.indexOf("~",5);
    const mappingB64=chunk.slice(6,separatorIndex);
    const mapping=JSON.parse(atob(mappingB64));
    let data=chunk.slice(separatorIndex+1,5+markerLength);
    data=data.split("").filter((_,i)=>i%2===0).join("");
    return data.split("|").map(ch=>customDecodeChar(ch,mapping)).join("");
  }catch{return "[Decoding error]";}
}

// --- Main Encode Function ---
function encode(){
  const input=document.getElementById("inputText").value;
  if(!input)return;

  let encodedChars=[];
  for(const char of input){
    let s=char;
    let encoders=shuffleArray(Object.keys(standardEncoders).filter(k=>!k.includes("Decode")));
    for(const enc of encoders){
      s=standardEncoders[enc](s); s=standardEncoders[enc](s);
    }
    s=recursiveCustomEncode(s,3);
    encodedChars.push(s);
  }
  document.getElementById("outputText").value=encodedChars.join("");
}

// --- Main Decode Function ---
function decode(){
  const input=document.getElementById("decodeInput").value;
  if(!input)return;
  let output="";
  let i=0;
  while(i<input.length){
    const markerLength=parseInt(input.slice(i,i+5));
    const chunk=input.slice(i,i+5+markerLength);
    const decoded=recursiveCustomDecode(chunk);
    output+=decoded;
    i+=5+markerLength;
  }
  document.getElementById("decodeOutput").value=output;
}

// --- Copy ---
function copyOutput(){ const o=document.getElementById("outputText"); if(!o.value)return; navigator.clipboard.writeText(o.value).then(()=>alert("Encoded copied!")) }
function copyDecoded(){ const o=document.getElementById("decodeOutput"); if(!o.value)return; navigator.clipboard.writeText(o.value).then(()=>alert("Decoded copied!")) }
