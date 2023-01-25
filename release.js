export async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
      "console.error"(text) {
        // ~lib/bindings/dom/console.error(~lib/string/String) => void
        text = __liftString(text >>> 0);
        console.error(text);
      },
      "console.log"(text) {
        // ~lib/bindings/dom/console.log(~lib/string/String) => void
        text = __liftString(text >>> 0);
        console.log(text);
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    loadRom(buffer) {
      // assembly/index/loadRom(~lib/typedarray/Uint8Array) => void
      buffer = __lowerTypedArray(Uint8Array, 6, 0, buffer) || __notnull();
      exports.loadRom(buffer);
    },
    hasCartridge() {
      // assembly/index/hasCartridge() => bool
      return exports.hasCartridge() != 0;
    },
    getScreen() {
      // assembly/index/getScreen() => ~lib/typedarray/Uint8ClampedArray
      return __liftTypedArray(Uint8ClampedArray, exports.getScreen() >>> 0);
    },
    getMemory() {
      // assembly/Memory/debug/getMemory() => ~lib/typedarray/Uint8Array
      return __liftTypedArray(Uint8Array, exports.getMemory() >>> 0);
    },
    getRegisters() {
      // assembly/CPU/debug/getRegisters() => ~lib/typedarray/Uint16Array
      return __liftTypedArray(Uint16Array, exports.getRegisters() >>> 0);
    },
    getWholeTileData() {
      // assembly/PPU/debug/getWholeTileData() => ~lib/typedarray/Uint8ClampedArray
      return __liftTypedArray(Uint8ClampedArray, exports.getWholeTileData() >>> 0);
    },
    getBackground() {
      // assembly/PPU/debug/getBackground() => ~lib/typedarray/Uint8ClampedArray
      return __liftTypedArray(Uint8ClampedArray, exports.getBackground() >>> 0);
    },
    getWindow() {
      // assembly/PPU/debug/getWindow() => ~lib/typedarray/Uint8ClampedArray
      return __liftTypedArray(Uint8ClampedArray, exports.getWindow() >>> 0);
    },
  }, exports);
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  function __liftTypedArray(constructor, pointer) {
    if (!pointer) return null;
    return new constructor(
      memory.buffer,
      __getU32(pointer + 4),
      __dataview.getUint32(pointer + 8, true) / constructor.BYTES_PER_ELEMENT
    ).slice();
  }
  function __lowerTypedArray(constructor, id, align, values) {
    if (values == null) return 0;
    const
      length = values.length,
      buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0,
      header = exports.__new(12, id) >>> 0;
    __setU32(header + 0, buffer);
    __dataview.setUint32(header + 4, buffer, true);
    __dataview.setUint32(header + 8, length << align, true);
    new constructor(memory.buffer, buffer, length).set(values);
    exports.__unpin(buffer);
    return header;
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  let __dataview = new DataView(memory.buffer);
  function __setU32(pointer, value) {
    try {
      __dataview.setUint32(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setUint32(pointer, value, true);
    }
  }
  function __getU32(pointer) {
    try {
      return __dataview.getUint32(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getUint32(pointer, true);
    }
  }
  return adaptedExports;
}
