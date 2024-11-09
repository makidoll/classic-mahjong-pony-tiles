// ==UserScript==
// @name        Classic Mahjong Pony Tiles
// @namespace   https://maki.cafe
// @match       https://classic-mahjong.com/*
// @grant       none
// @version     1.1
// @author      Maki
// @description Pony themed tiles for https://classic-mahjong.com
// @homepageURL https://github.com/makidoll/classic-mahjong-pony-tiles
// @icon https://raw.githubusercontent.com/makidoll/classic-mahjong-pony-tiles/refs/heads/main/icon.png
// @downloadURL https://raw.githubusercontent.com/makidoll/classic-mahjong-pony-tiles/refs/heads/main/script.user.js
// ==/UserScript==

const ponyAtlasImageUrl =
	"https://raw.githubusercontent.com/makidoll/classic-mahjong-pony-tiles/refs/heads/main/classic-mahjong/pony-atlas.png";

const global = eval("this");

const OriginalWorker = global.Worker;

global.Worker = class MockWorker extends OriginalWorker {
	constructor(...args) {
		super(...args);
	}

	postMessage(...args) {
		if (
			args.length == 0 ||
			typeof args[0] != "object" ||
			args[0].id != "loadImageBitmap"
		) {
			return super.postMessage(...args);
		}

		for (let i = 0; i < args[0].data.length; i++) {
			if (!args[0].data[i].endsWith("modern/atlas-@2x.png")) continue;
			args[0].data[i] = ponyAtlasImageUrl;
		}

		return super.postMessage(...args);
	}
};

// function updateWallpaper() {
// 	document.querySelector(
// 		"#mahjong-container",
// 	).style.backgroundImage = `url(https://hotmilk.space/u/eK4i2z.png)`;
// }

// const observer = new MutationObserver(() => {
// 	updateWallpaper();
// });

// observer.observe(document.querySelector("#mahjong-container"), {
// 	attributes: true,
// });
