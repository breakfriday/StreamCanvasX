const Module = {};
let script;
export default function loadWASM() {
  return new Promise((resolve, reject) => {
    self.fetch('./watermark.wasm')
        .then((response) => response.arrayBuffer())
        .then((buffer) => {
          Module.wasmBinary = buffer;
          const script = document.createElement('script');
          script.onload = buildWam;
          script.src = './watermark.js';
          // script.src = 'watermark.js';
          document.body.appendChild(script);

          function buildWam() {
            console.log('Emscripten boilerplate loaded.');
            const wam = {};
            wam['watermarkArnoldDCT'] = function (pixelData, width, height, watermarkData, size, count) {
              const len = pixelData.length;
              const len2 = watermarkData.length;
              const mem = _malloc(len + len2);
              HEAPU8.set(pixelData, mem);
              HEAPU8.set(watermarkData, mem + len);
              _watermarkArnoldDCT(mem, width, height, mem + len, size, count);
              const filtered = HEAPU8.subarray(mem, mem + len);
              _free(mem);
              return filtered;
            };
            wam['watermarkArnoldIDCT'] = function (pixelData, width, height, watermarkData, size, count) {
              const len = pixelData.length;
              const len2 = size * size * 4;
              const mem = _malloc(len + len2);
              HEAPU8.set(pixelData, mem);
              HEAPU8.set(watermarkData, mem + len);
              _watermarkArnoldIDCT(mem, width, height, mem + len, size, count);
              // const filtered = HEAPU8.subarray(mem, mem+len);
              const filtered2 = HEAPU8.subarray(mem + len, mem + len + len2);
              _free(mem);
              return filtered2;
            };
            resolve(wam);
          }
      });
  });
}