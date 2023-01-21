import { instantiate } from "./instantiate.js";
import { updateInputs, wasmSetJoypadState } from "./joypad.js";

const loadRomBtn = document.getElementById("loadRom");
const resetBtn = document.getElementById("reset");
const fileInput = document.getElementById("file");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let wasmExports = null;

async function init() {
  try {
    wasmExports = await instantiate(
      await WebAssembly.compileStreaming(fetch("./release.wasm")),
      {
        env: undefined,
      }
    );
  } catch (err) {
    console.error(err);
  }
}

init();

loadRomBtn.onclick = () => {
  fileInput.click();
};

resetBtn.onclick = () => {
  if (wasmExports.hasCartridge()) {
    wasmExports.reset();
  }
};

fileInput.onchange = (e) => {
  const file = e?.target?.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      const romBuffer = evt?.target?.result;
      wasmExports.loadRom(new Uint8Array(romBuffer));
      play();
    };
    reader.readAsArrayBuffer(file);
  }
};

function play() {
  setInterval(() => {
    console.log("cc");
    wasmSetJoypadState(wasmExports);
    wasmExports.execFrame(1);
    const screenBuffer = wasmExports.getScreen();
    const imageData = new ImageData(screenBuffer, 160, 144);
    context.putImageData(imageData, 0, 0);
  }, 1000 / 60);
}

window.addEventListener("keydown", (e) => updateInputs(e.key, true));
window.addEventListener("keyup", (e) => updateInputs(e.key, false));
