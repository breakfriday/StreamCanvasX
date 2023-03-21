import Hls from 'hls.js';

function serializeQuerystring(obj) {
  const str =
    `?${
      Object.keys(obj)
        .reduce((a, k) => {
          a.push(`${k}=${encodeURIComponent(obj[k])}`);
          return a;
        }, [])
        .join('&')}`;
  return str;
}

const muxManifestUrl = (playbackId) =>
  `https://stream.mux.com/${playbackId}.m3u8`;

const muxThumbnail = (playbackId, options = {}) =>
  `https://image.mux.com/${playbackId}/thumbnail.jpg${serializeQuerystring(
    options,
  )}`;


const player = (el: HTMLVideoElement) => {
  if (Hls.isSupported()) {
    const video = el;


    const playbackId = video.getAttribute('data-playback-id');
    const posterTime = video.getAttribute('data-poster-time');
    video.setAttribute(
      'poster',
      video.poster || muxThumbnail(playbackId, { time: posterTime }),
    );

    const hls = new Hls();
    hls.loadSource(muxManifestUrl(playbackId));
    hls.attachMedia(video);
  }
};


export default player;
