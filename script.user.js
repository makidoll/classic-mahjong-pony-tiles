// ==UserScript==
// @name        Classic Mahjong Pony Tiles
// @namespace   https://maki.cafe
// @match       https://classic-mahjong.com/*
// @grant       none
// @version     1.0
// @author      Maki
// @description Pony themed tiles for https://classic-mahjong.com
// @homepageURL https://github.com/makidoll/classic-mahjong-pony-tiles
// @icon https://raw.githubusercontent.com/makidoll/classic-mahjong-pony-tiles/refs/heads/main/icon.png
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
		if (!Array.isArray(args)) {
			return super.postMessage(...args);
		}

		for (let i = 0; i < args.length; i++) {
			if (typeof args[i] != "object") continue;
			if (args[i].id != "loadImageBitmap") continue;
			if (!Array.isArray(args[i].data)) continue;

			for (let j = 0; j < args[i].data.length; j++) {
				if (typeof args[i].data[j] != "string") continue;
				if (!args[i].data[j].endsWith("modern/atlas-@2x.png")) continue;

				args[i].data[j] = ponyAtlasImageUrl;
			}
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
