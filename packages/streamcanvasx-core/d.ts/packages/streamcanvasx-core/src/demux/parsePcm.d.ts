/**
 * @param {Uint8Array} data G.711 alaw data
 * @returns {Uint8Array} 16 bit pcm data
 */
export function decodeAlaw(data: Uint8Array): Uint8Array;
/**
 * @param {Uint8Array} data G.711 ulaw data
 * @returns {Uint8Array} 16 bit pcm data
 */
export function decodeUlaw(data: Uint8Array): Uint8Array;
