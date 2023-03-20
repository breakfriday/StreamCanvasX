import Hls from "hls.js";

function serializeQuerystring(obj) {
  let str =
    "?" +
    Object.keys(obj)
      .reduce(function(a, k) {
        a.push(k + "=" + encodeURIComponent(obj[k]));
        return a;
      }, [])
      .join("&");
  return str;
}

const muxManifestUrl = playbackId =>
  `https://stream.mux.com/${playbackId}.m3u8`;

const muxThumbnail = (playbackId, options = {}) =>
  `https://image.mux.com/${playbackId}/thumbnail.jpg${serializeQuerystring(
    options
  )}`;

if (Hls.isSupported()) {
  const videos = document.querySelectorAll("video[data-playback-id]");
  videos.forEach(video => {
    const playbackId = video.getAttribute("data-playback-id");
    const posterTime = video.getAttribute("data-poster-time");
    video.setAttribute(
      "poster",
      video.poster || muxThumbnail(playbackId, { time: posterTime })
    );

    var hls = new Hls();
    hls.loadSource(muxManifestUrl(playbackId));
    hls.attachMedia(video);
  });
}
