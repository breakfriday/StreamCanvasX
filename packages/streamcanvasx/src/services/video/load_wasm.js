// const Module = {};
// window.watermark = {};
// let script;
// export default function loadWASM() {
//   return new Promise((resolve, reject) => {
//     self.fetch('./watermark.wasm')
//         .then((response) => response.arrayBuffer())
//         .then((buffer) => {
//           Module.wasmBinary = buffer;
//           const script = document.createElement('script');
//           script.onload = buildWam;
//           script.src = './watermark.js';
//           // script.src = 'watermark.js';
//           document.body.appendChild(script);

//           async function buildWam() {
//             console.log('Emscripten boilerplate loaded.');
//             window.watermark = await createWatermark();
//             const wam = {};
//             wam['watermarkArnoldDCT'] = function (pixelData, width, height, watermarkData, size, count) {
//               const len = pixelData.length;
//               const len2 = watermarkData.length;
//               const mem = window.watermark._malloc(len + len2);
//               window.watermark.HEAPU8.set(pixelData, mem);
//               window.watermark.HEAPU8.set(watermarkData, mem + len);
//               window.watermark._watermarkArnoldDCT(mem, width, height, mem + len, size, count);
//               const filtered = window.watermark.HEAPU8.subarray(mem, mem + len);
//               window.watermark._free(mem);
//               return filtered;
//             };
//             wam['watermarkArnoldIDCT'] = function (pixelData, width, height, watermarkData, size, count) {
//               const len = pixelData.length;
//               const len2 = size * size * 4;
//               const mem = window.watermark._malloc(len + len2);
//               window.watermark.HEAPU8.set(pixelData, mem);
//               window.watermark.HEAPU8.set(watermarkData, mem + len);
//               window.watermark._watermarkArnoldIDCT(mem, width, height, mem + len, size, count);
//               // const filtered = HEAPU8.subarray(mem, mem+len);
//               const filtered2 = window.watermark.HEAPU8.subarray(mem + len, mem + len + len2);
//               window.watermark._free(mem);
//               return filtered2;
//             };

//             resolve(wam);
//           }
//       });
//   });
// }