const inputs = {
  select: false,
  start: false,
  a: false,
  b: false,
  up: false,
  down: false,
  left: false,
  right: false,
};

export function updateInputs(key, shouldActivate) {
  switch (key) {
    case "ArrowDown": {
      inputs.down = shouldActivate;
      break;
    }
    case "ArrowUp": {
      inputs.up = shouldActivate;
      break;
    }
    case "ArrowLeft": {
      inputs.left = shouldActivate;
      break;
    }
    case "ArrowRight": {
      inputs.right = shouldActivate;
      break;
    }
    case "Enter": {
      inputs.start = shouldActivate;
      break;
    }
    case "Shift": {
      inputs.select = shouldActivate;
      break;
    }
    case "a": {
      inputs.a = shouldActivate;
      break;
    }
    case "s": {
      inputs.b = shouldActivate;
      break;
    }
  }
}

export function wasmSetJoypadState(wasmExports) {
  wasmExports.setJoypadState(
    inputs.up ? 1 : 0,
    inputs.right ? 1 : 0,
    inputs.down ? 1 : 0,
    inputs.left ? 1 : 0,
    inputs.a ? 1 : 0,
    inputs.b ? 1 : 0,
    inputs.select ? 1 : 0,
    inputs.start ? 1 : 0
  );
}
