/*

MIT License

Copyright 2024 justcontributor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
// ==UserScript==
// @name            YouTube Shorts Control
// @namespace       https://github.com/justcontributor/yt-shorts-control
// @homepageURL     https://github.com/justcontributor/yt-shorts-control
// @supportURL      https://github.com/justcontributor/yt-shorts-control/issues
// @updateURL       https://github.com/justcontributor/yt-shorts-control/raw/main/script.user.js
// @downloadURL     https://github.com/justcontributor/yt-shorts-control/raw/main/script.user.js
// @license         MIT License
// @version         1.0
// @description     Userscript that allows you to use shortcut keys for regular videos in YouTube Shorts
// @description:ko  YouTube Shorts에서도 일반 동영상의 단축키를 활용할 수 있도록 해주는 유저스크립트
// @author          justcontributor
// @match           *://www.youtube.com/shorts/*
// @icon            https://kstatic.googleusercontent.com/files/f307064f5c08b8a689d27283d55ad3dded6ca42545570eaa203cd90cd71ddd9d733a8856d251146658af76451646aa31b9033c3de769af0acd01e88af9de9a04
// @grant           none
// @run-at          document-start
// ==/UserScript==

let checkLoadInterval;
let rateLabel;
let rateLabelTimer;

(function () {
  "use strict";
  checkLoadInterval = setInterval(checkPlayerLoaded, 100);
  addKeyListener();
})();

function addKeyListener() {
  window.addEventListener(
    "keydown",
    (e) => {
      const video = document.querySelector("video");
      if (e.shiftKey) {
        switch (e.key) {
          case ">":
          case "<":
            const focus = e.target.tagName.toUpperCase();
            const typing =
              focus === "INPUT" ||
              focus === "TEXTAREA" ||
              e.target.getAttribute("contentEditable");

            if (typing) return;
            e.preventDefault();
            e.stopImmediatePropagation();
            sign = e.key === ">" ? 1 : -1;
            step = video.playbackRate + sign * 0.25 > 2 ? 0.5 : 0.25;
            newRate = video.playbackRate + step * sign;
            if (newRate > 16 || newRate < 0.25) {
              setRateLabelText(`브라우저의 속도 제한에 도달했습니다.`);
              showRateLabel();
              return;
            }
            video.playbackRate = newRate;
            setRateLabelText(`${newRate}x`);
            showRateLabel();
            break;
        }
      } else {
        switch (e.key) {
          case "j":
            video.currentTime -= 10;
            break;
          case "l":
            video.currentTime += 10;
            break;
          case "Space":
          case "k":
            video.paused ? video.play() : video.pause();
            break;
          case "ArrowLeft":
            video.currentTime -= 5;
            break;
          case "ArrowRight":
            video.currentTime += 5;
            break;
          default:
            n = parseInt(e.key);
            if (!isNaN(n)) {
              video.currentTime = video.duration * n * 0.1;
            }
        }
      }
    },
    true
  );
}

function createRateLabel() {
  rateLabel = document.createElement("div");
  rateLabel.style.cssText = `
    left:50%;
    top:10%;
    transform:translate(-50%,0);
    text-align:center;
    background-color: rgba(0,0,0,0.5);
    display:none;
    font-size:3rem;
    position:absolute;
    z-index:19;
    font-family "YouTube Noto", Roboto, Arial, Helvetica, sans-serif;
    color: #eee;
    direction: ltr;
    font-size: 175%;
    padding: 10px 20px;
    border-radius: 3px;
    line-height: 1.5;
    `;
  const playerContainer = document.getElementById("shorts-player");
  playerContainer.appendChild(rateLabel);
  console.log("[More Variable YouTube Speed] UserScript is Ready.");
}

function setRateLabelText(s) {
  rateLabel.innerText = s;
}

function checkPlayerLoaded() {
  const target = document.getElementById("shorts-player");
  if (target) {
    clearInterval(checkLoadInterval);
    createRateLabel();
  }
}

function showRateLabel() {
  rateLabel.style.setProperty("display", "inline", "important");
  if (rateLabelTimer) clearTimeout(rateLabelTimer);
  rateLabelTimer = setTimeout(() => {
    rateLabel.style.setProperty("display", "none", "important");
  }, 500);
}
