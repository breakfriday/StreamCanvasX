/*! For license information please see fdccd7e9.b497c69c.js.LICENSE.txt */
"use strict";(self.webpackChunkstreamcanvasx=self.webpackChunkstreamcanvasx||[]).push([[71],{6679:(t,e,n)=>{n.r(e),n.d(e,{default:()=>i});var o=n(2650),r=n(2157).Z;const i=function(){return r(o.Z,null,(function(){var t=n(1724).Z;return r(t,null)}))}},1724:(t,e,n)=>{n.d(e,{Z:()=>d});var o=n(2983),r=n(830),i=n(1564),a=n(1138);const c=function(){var t=e.prototype;function e(t){(0,a._)(this,"context",void 0),(0,a._)(this,"dataArray",void 0),(0,a._)(this,"bufferLength",void 0),(0,a._)(this,"bufferData",void 0),(0,a._)(this,"bufferDataLength",void 0);var e=t.canvas_el,n=t.media_el;this.context={},e&&this.setCanvasDom(e),this.createAudioContext(),this.setMediaSource_el(n),this.audioContextConnect()}return t.createAudioContext=function(){this.context.audioContext=new AudioContext,this.context.analyserNode=this.context.audioContext.createAnalyser(),this.bufferLength=this.context.analyserNode.fftSize,this.dataArray=new Float32Array(this.bufferLength),this.setBufferData()},t.setBufferData=function(){this.bufferDataLength=Math.ceil(1*this.context.audioContext.sampleRate/this.dataArray.length)*this.dataArray.length,this.bufferData=new Float32Array(this.bufferDataLength)},t.updateBufferData=function(){var t,e=this.dataArray,n=this.bufferData,o=this.bufferDataLength;n.copyWithin(0,e.length),null===(t=this.context.analyserNode)||void 0===t||t.getFloatTimeDomainData(e),n.set(e,o-e.length),requestAnimationFrame(this.updateBufferData.bind(this))},t.drawWithBufferData=function(){var t=this,e=this.bufferData,n=this.bufferDataLength;!function o(){t.context.canvasContext.clearRect(0,0,t.context.canvas.width,t.context.canvas.height),t.context.canvasContext.lineWidth=2,t.context.canvasContext.strokeStyle="#7f0",t.context.canvasContext.beginPath();for(var r=t.context.canvas.width/n,i=0,a=0;a<n;a++){var c=e[a]*t.context.canvas.height/2,s=t.context.canvas.height/2+c;0===a?t.context.canvasContext.moveTo(i,s):t.context.canvasContext.lineTo(i,s),i+=r}t.context.canvasContext.lineTo(t.context.canvas.width,t.context.canvas.height/2),t.context.canvasContext.stroke(),requestAnimationFrame(o.bind(t))}()},t.setCanvasDom=function(t){this.context.canvas=t,this.context.canvasContext=this.context.canvas.getContext("2d")},t.setMediaSource_el=function(t){this.context.mediaSource_el=t,this.context.audioSourceNode=this.context.audioContext.createMediaElementSource(t)},t.resetAudioContextConnec=function(){var t;null===(t=this.context.audioSourceNode)||void 0===t||t.disconnect(),this.audioContextConnect()},t.audioContextConnect=function(){this.context.audioSourceNode.connect(this.context.analyserNode),this.context.analyserNode.connect(this.context.audioContext.destination)},t.mute=function(t){!0===t?this.context.analyserNode.disconnect(this.context.audioContext.destination):this.context.analyserNode.connect(this.context.audioContext.destination)},t.visulizerDraw=function(){var t=this,e=this.context.analyserNode.frequencyBinCount,n=new Uint8Array(e);!function o(){requestAnimationFrame(o.bind(t)),t.context.analyserNode.getByteFrequencyData(n),t.context.canvasContext.fillStyle="rgb(255, 255, 255)",t.context.canvasContext.fillRect(0,0,t.context.canvas.width,t.context.canvas.height);for(var r,i=t.context.canvas.width/e*2.5,a=0,c=0;c<e;c++){r=n[c]/2;t.context.canvasContext.fillStyle="rgb(0, 0, 0)",t.context.canvasContext.fillRect(a,t.context.canvas.height-r,i,r),a+=i+1}}()},t.visulizerDraw1=function(){var t=this,e=this.context.analyserNode.frequencyBinCount,n=new Uint8Array(e);!function o(){requestAnimationFrame(o.bind(t)),t.context.analyserNode.getByteFrequencyData(n),t.context.canvasContext.fillStyle="#000",t.context.canvasContext.fillRect(0,0,t.context.canvas.width,t.context.canvas.height);for(var r,i=t.context.canvas.width/e*2.5,a=0,c=0;c<e;c++){var s=(r=n[c])+c/e*25,u=c/e*250;t.context.canvasContext.fillStyle="rgb("+s+","+u+",50)",t.context.canvasContext.fillRect(a,t.context.canvas.height-r,i,r),a+=i+1}}()},t.visulizerDraw2=function(){var t=this,e=this.context.analyserNode.frequencyBinCount,n=new Uint8Array(e);!function o(){requestAnimationFrame(o.bind(t)),t.context.analyserNode.getByteFrequencyData(n),t.context.canvasContext.fillStyle="rgba(0, 0, 0, 0.05)",t.context.canvasContext.fillRect(0,0,t.context.canvas.width,t.context.canvas.height),t.context.canvasContext.lineWidth=2,t.context.canvasContext.strokeStyle="rgb(0, 255, 0)",t.context.canvasContext.beginPath();for(var r=1*t.context.canvas.width/e,i=0,a=0;a<e;a++){var c=n[a]/128*t.context.canvas.height/2;0===a?t.context.canvasContext.moveTo(i,c):t.context.canvasContext.lineTo(i,c),i+=r}t.context.canvasContext.lineTo(t.context.canvas.width,t.context.canvas.height/2),t.context.canvasContext.stroke()}()},t.visulizerDraw3=function(){var t=this,e=this.bufferLength,n=this.dataArray;!function o(){t.context.analyserNode.getFloatTimeDomainData(n),t.context.canvasContext.clearRect(0,0,t.context.canvas.width,t.context.canvas.height),t.context.canvasContext.lineWidth=2,t.context.canvasContext.strokeStyle="#7f0",t.context.canvasContext.beginPath();for(var r=t.context.canvas.width/e,i=0,a=0;a<e;a++){var c=n[a]*t.context.canvas.height/2,s=t.context.canvas.height/2+c;0===a?t.context.canvasContext.moveTo(i,s):t.context.canvasContext.lineTo(i,s),i+=r}t.context.canvasContext.lineTo(t.context.canvas.width,t.context.canvas.height/2),t.context.canvasContext.stroke(),requestAnimationFrame(o.bind(t))}()},t.visulizerDraw4=function(){var t=this,e=this.context.analyserNode.fftSize,n=new Float32Array(e);!function o(){requestAnimationFrame(o.bind(t)),t.context.analyserNode.getFloatTimeDomainData(n),t.context.canvasContext.fillStyle="rgba(0, 0, 0, 0.1)",t.context.canvasContext.fillRect(0,0,t.context.canvas.width,t.context.canvas.height),t.context.canvasContext.lineWidth=2,t.context.canvasContext.strokeStyle="rgb(0, 255, 0)",t.context.canvasContext.beginPath();for(var r=1*t.context.canvas.width/e,i=0,a=0;a<e;a++){var c=n[a]/128*t.context.canvas.height/2;0===a?t.context.canvasContext.moveTo(i,c):t.context.canvasContext.lineTo(i,c),i+=r}t.context.canvasContext.lineTo(t.context.canvas.width,t.context.canvas.height/2),t.context.canvasContext.stroke()}()},e}();var s=n(8003);i.Fc.bind(s.v.IAudioProcessingService).toFactory((function(t){return function(t){return new c(t)}}));var u=n(2157).Z,h=n(2983).Fragment,l=o.useRef,v=o.useEffect;const d=function(){var t=o.useRef(null),e=o.useRef(null),n=l(null),a=l(null);v((function(){var o=(0,r.s)({root_el:null==t?void 0:t.current,canvas_el:null==e?void 0:e.current});n.current=o,c()}),[]);var c=function(){var t,e=null==(t=n.current)?void 0:t._vedio;e&&e.addEventListener("play",(function(){var t,n=(t={media_el:e,canvas_el:a.current},i.Fc.get(s.v.IAudioProcessingService)(t));n.updateBufferData(),n.drawWithBufferData()}))};return u(h,null,u("div",null,u("input",{type:"file",id:"file-input",accept:"audio/*,video/*",onChange:function(t){var e,o,r=n.current,i=null==(e=t.target)||null==(o=e.files)?void 0:o[0];i&&r.set_blob_url(i)}}),u("div",{style:{display:"flex",flexDirection:"row"}},u("div",{ref:t,style:{width:"300px",height:"300px"}}),u("canvas",{ref:e,width:"300",height:"300",style:{marginLeft:"15px",display:"none"}}),u("div",null,u("canvas",{style:{background:"black"},ref:a,id:"canvas",width:"300",height:"300"})))))}},1564:(t,e,n)=>{n.d(e,{Fc:()=>r,Zq:()=>i});n(171);var o=n(9768),r=new o.W,i=new o.W},830:(t,e,n)=>{n.d(e,{s:()=>x});var o=n(1564),r=n(189),i=n(7866),a=n(5368),c=n(1138),s=n(6398),u=n(9513),h=n(6269),l=n.n(h),v=function(){var t=e.prototype;function e(t){(0,c._)(this,"video",void 0),(0,c._)(this,"canvas",void 0),(0,c._)(this,"context",void 0),(0,c._)(this,"mpegtsPlayer",void 0),(0,c._)(this,"root_el",void 0),(0,c._)(this,"aspectRatio",void 0),(0,c._)(this,"metadata",void 0),(0,c._)(this,"config",void 0),this.video=document.createElement("video"),this.video.controls=!0,this.canvas=t.canvas_el,this.root_el=t.root_el,this.config=t.config||{},this.canvas&&(this.context=this.canvas.getContext("2d")),this.root_el.innerHTML="",this.root_el.appendChild(this.video),this.setVideoSize(),this.vedioEvents()}return t.createFlvPlayer=function(t){var e=this,n=t.type,o=t.isLive,r=t.url,i=this.video;i&&(this.mpegtsPlayer=l().createPlayer({type:n,isLive:o,url:r,hasAudio:!0}),this.mpegtsPlayer.attachMediaElement(i),this.getVideoSize(),this.mpegtsPlayer.load(),this.mpegtsPlayer.on(l().Events.MEDIA_INFO,(function(t){var n=t.metadata.width,o=t.metadata.height;e.metadata={video_height:o,video_width:n},e.getVideoSize()})),this.mpegtsPlayer.on(l().Events.METADATA_ARRIVED,(function(t){e.mpegtsPlayer.play()})),this.mpegtsPlayer.on(l().Events.ERROR,(function(t,n){if(t===l().ErrorTypes.NETWORK_ERROR&&(n===l().ErrorDetails.NETWORK_UNRECOVERABLE_EARLY_EOF&&e.reoload(),n===l().ErrorDetails.NETWORK_TIMEOUT))return!1})))},t.setConfig=function(t){this.config=Object.assign({},this.config,t)},t.load=function(){this.mpegtsPlayer.load()},t.play=function(){this.mpegtsPlayer.play()},t.paused=function(){this.mpegtsPlayer.pause()},t.reoload=function(){this.mpegtsPlayer.unload(),this.mpegtsPlayer.detachMediaElement(),this.mpegtsPlayer.attachMediaElement(this.video),this.mpegtsPlayer.load(),this.mpegtsPlayer.play()},t.set_blob_url=function(t){var e=URL.createObjectURL(t);this.video.src=e,this.video.load()},t.vedioEvents=function(){var t=this;this.loadMediaEvent(),this.video.addEventListener("play",(function(){t.analyzeCanvas.call(t)}),!1)},t.getVideoSize=function(){var t={},e=t.videoHeight,n=void 0===e?0:e,o=t.videoWidth,r=void 0===o?0:o;this.metadata?(r=this.metadata.video_width,n=this.metadata.video_height):(n=this.video.videoHeight,r=this.video.videoWidth);var i=function t(e,n){return 0===n?e:t(n,e%n)}(r,n),a=r/i,c=n/i,s=a+":"+c;this.aspectRatio=a/c,console.log("------------------------"),console.log(s),console.log("------------------------")},t.loadMediaEvent=function(){var t=this,e=this.video;e&&e.addEventListener("loadedmetadata",(function(){t.getVideoSize()}))},t.setVideoSize=function(){var t=this.root_el.clientHeight,e=this.root_el.clientWidth;this.video.height=t,this.video.width=e},t.renderByWebGpu=function(){var t=(0,i.Z)((0,r.Z)().mark((function t(){var e,n,o,i=this;return(0,r.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,navigator.gpu.requestAdapter();case 2:return e=t.sent,t.next=5,e.requestDevice();case 5:n=t.sent,o=n.createTexture({size:{width:this.video.videoWidth,height:this.video.videoHeight,depth:1},format:"rgba8unorm",usage:window.GPUTextureUsage.COPY_DST|window.GPUTextureUsage.RENDER_ATTACHMENT}),function t(){n.queue.copyExternalImageToTexture({source:i.video},{texture:o},[i.video.videoWidth,i.video.videoHeight,1]),requestAnimationFrame(t.bind(i))}.call(this);case 9:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}(),t.analyzeCanvas=function(){var t=this,e=this.canvas.width,n=this.canvas.height/this.aspectRatio,o=this.context.getImageData(0,0,1,1).data;o[0],o[1],o[2];!function o(){t.video.ended||t.video.paused||(t.context.drawImage(t.video,0,0,e,n),requestAnimationFrame(o.bind(t)))}()},(0,a.Z)(e,[{key:"_vedio",get:function(){return this.video}}]),e}();const d=v=(0,s.gn)([(0,u.b)()],v);var f=n(8003);function x(t){return o.Fc.get(f.v.IMainPlayerService)(t)}o.Fc.bind(f.v.IMainPlayerService).toFactory((function(t){return function(t){return new d(t)}}))},8003:(t,e,n)=>{n.d(e,{v:()=>o});var o={IOriginSerivce:Symbol.for("IOriginSerivce"),IServiceA:Symbol.for("IServiceA"),IAudioProcessingService:Symbol.for("IAudioProcessingService"),IMainPlayerService:Symbol.for("IMainPlayerService"),IPlayerService:Symbol.for("IPlayerService"),IHttpFlvStreamLoader:Symbol.for("IHttpFlvStreamLoader"),IFLVDemuxService:Symbol.for(" IFLVDemuxService"),IWebcodecsDecoderService:Symbol.for("IWebcodecsDecoderService"),ICanvasVideoService:Symbol.for("ICanvasVideoService"),IDebugLogService:Symbol.for("IDebugLogService"),IFLVDemuxStream:Symbol.for("IFLVDemuxStream")}},7866:(t,e,n)=>{function o(t,e,n,o,r,i,a){try{var c=t[i](a),s=c.value}catch(u){return void n(u)}c.done?e(s):Promise.resolve(s).then(o,r)}function r(t){return function(){var e=this,n=arguments;return new Promise((function(r,i){var a=t.apply(e,n);function c(t){o(a,r,i,c,s,"next",t)}function s(t){o(a,r,i,c,s,"throw",t)}c(void 0)}))}}n.d(e,{Z:()=>r})},5368:(t,e,n)=>{n.d(e,{Z:()=>i});var o=n(3955);function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,(0,o.Z)(r.key),r)}}function i(t,e,n){return e&&r(t.prototype,e),n&&r(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}},189:(t,e,n)=>{n.d(e,{Z:()=>r});var o=n(6283);function r(){r=function(){return t};var t={},e=Object.prototype,n=e.hasOwnProperty,i=Object.defineProperty||function(t,e,n){t[e]=n.value},a="function"==typeof Symbol?Symbol:{},c=a.iterator||"@@iterator",s=a.asyncIterator||"@@asyncIterator",u=a.toStringTag||"@@toStringTag";function h(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{h({},"")}catch(F){h=function(t,e,n){return t[e]=n}}function l(t,e,n,o){var r=e&&e.prototype instanceof f?e:f,a=Object.create(r.prototype),c=new D(o||[]);return i(a,"_invoke",{value:S(t,n,c)}),a}function v(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(F){return{type:"throw",arg:F}}}t.wrap=l;var d={};function f(){}function x(){}function y(){}var g={};h(g,c,(function(){return this}));var p=Object.getPrototypeOf,m=p&&p(p(P([])));m&&m!==e&&n.call(m,c)&&(g=m);var w=y.prototype=f.prototype=Object.create(g);function b(t){["next","throw","return"].forEach((function(e){h(t,e,(function(t){return this._invoke(e,t)}))}))}function C(t,e){function r(i,a,c,s){var u=v(t[i],t,a);if("throw"!==u.type){var h=u.arg,l=h.value;return l&&"object"==(0,o.Z)(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,c,s)}),(function(t){r("throw",t,c,s)})):e.resolve(l).then((function(t){h.value=t,c(h)}),(function(t){return r("throw",t,c,s)}))}s(u.arg)}var a;i(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function S(t,e,n){var o="suspendedStart";return function(r,i){if("executing"===o)throw new Error("Generator is already running");if("completed"===o){if("throw"===r)throw i;return A()}for(n.method=r,n.arg=i;;){var a=n.delegate;if(a){var c=_(a,n);if(c){if(c===d)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===o)throw o="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o="executing";var s=v(t,e,n);if("normal"===s.type){if(o=n.done?"completed":"suspendedYield",s.arg===d)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o="completed",n.method="throw",n.arg=s.arg)}}}function _(t,e){var n=e.method,o=t.iterator[n];if(void 0===o)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=void 0,_(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),d;var r=v(o,t.iterator,e.arg);if("throw"===r.type)return e.method="throw",e.arg=r.arg,e.delegate=null,d;var i=r.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,d):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,d)}function E(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function L(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function D(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(E,this),this.reset(!0)}function P(t){if(t){var e=t[c];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,r=function e(){for(;++o<t.length;)if(n.call(t,o))return e.value=t[o],e.done=!1,e;return e.value=void 0,e.done=!0,e};return r.next=r}}return{next:A}}function A(){return{value:void 0,done:!0}}return x.prototype=y,i(w,"constructor",{value:y,configurable:!0}),i(y,"constructor",{value:x,configurable:!0}),x.displayName=h(y,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===x||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,h(t,u,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},b(C.prototype),h(C.prototype,s,(function(){return this})),t.AsyncIterator=C,t.async=function(e,n,o,r,i){void 0===i&&(i=Promise);var a=new C(l(e,n,o,r),i);return t.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},b(w),h(w,u,"Generator"),h(w,c,(function(){return this})),h(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=Object(t),n=[];for(var o in e)n.push(o);return n.reverse(),function t(){for(;n.length;){var o=n.pop();if(o in e)return t.value=o,t.done=!1,t}return t.done=!0,t}},t.values=P,D.prototype={constructor:D,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(L),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function o(n,o){return a.type="throw",a.arg=t,e.next=n,o&&(e.method="next",e.arg=void 0),!!o}for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r],a=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var c=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(c&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var o=this.tryEntries.length-1;o>=0;--o){var r=this.tryEntries[o];if(r.tryLoc<=this.prev&&n.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var i=r;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,d):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),L(n),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var o=n.completion;if("throw"===o.type){var r=o.arg;L(n)}return r}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:P(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),d}},t}},3955:(t,e,n)=>{n.d(e,{Z:()=>r});var o=n(6283);function r(t){var e=function(t,e){if("object"!==(0,o.Z)(t)||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,e||"default");if("object"!==(0,o.Z)(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"===(0,o.Z)(e)?e:String(e)}}}]);