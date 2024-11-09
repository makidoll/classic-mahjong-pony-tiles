#!/usr/bin/env -S deno run -A

import { Jimp, ResizeStrategy } from "npm:jimp";
import * as path from "node:path";

const __dirname = new URL(".", import.meta.url).pathname;

// original is in this order

const tileTypes = [
	"Circle1",
	"Circle2",
	"Circle3",
	"Circle4",
	"Circle5",
	"Circle6",
	"Circle7",
	"Circle8",
	"Circle9",
	"Bamboo1",
	"Bamboo2",
	"Bamboo3",
	"Bamboo4",
	"Bamboo5",
	"Bamboo6",
	"Bamboo7",
	"Bamboo8",
	"Bamboo9",
	"Symbol1",
	"Symbol2",
	"Symbol3",
	"Symbol4",
	"Symbol5",
	"Symbol6",
	"Symbol7",
	"Symbol8",
	"Symbol9",
	"WindNorth",
	"WindSouth",
	"WindEast",
	"WindWest",
	"DragonGreen",
	"DragonWhite",
	"DragonRed",
	// might be slightly off
	"SeasonSpring",
	"SeasonSummer",
	"SeasonAutumn",
	"SeasonWinter",
	"FlowerPlum",
	"FlowerOrchid",
	"FlowerChrysanthemum",
	"FlowerBamboo",
] as const;

type TileType = typeof tileTypes;

const atlasSpec = await (
	await fetch(
		"https://classic-mahjong.com/static/games/mahjong-solitaire/assets/images/tiles/modern/atlas-@2x.json",
	)
).json();

const atlasMapping: Record<TileType[number], string> = {
	Circle1: "circle-1.png",
	Circle2: "circle-2.png",
	Circle3: "circle-3.png",
	Circle4: "circle-4.png",
	Circle5: "circle-5.png",
	Circle6: "circle-6.png",
	Circle7: "circle-7.png",
	Circle8: "circle-8.png",
	Circle9: "circle-9.png",
	Bamboo1: "bamboo-1.png",
	Bamboo2: "bamboo-2.png",
	Bamboo3: "bamboo-3.png",
	Bamboo4: "bamboo-4.png",
	Bamboo5: "bamboo-5.png",
	Bamboo6: "bamboo-6.png",
	Bamboo7: "bamboo-7.png",
	Bamboo8: "bamboo-8.png",
	Bamboo9: "bamboo-9.png",
	Symbol1: "symbol-1.png",
	Symbol2: "symbol-2.png",
	Symbol3: "symbol-3.png",
	Symbol4: "symbol-4.png",
	Symbol5: "symbol-5.png",
	Symbol6: "symbol-6.png",
	Symbol7: "symbol-7.png",
	Symbol8: "symbol-8.png",
	Symbol9: "symbol-9.png",
	// guessing
	WindNorth: "wind-1.png",
	WindSouth: "wind-2.png",
	WindEast: "wind-3.png",
	WindWest: "wind-4.png",
	DragonGreen: "dragon-1.png",
	DragonWhite: "dragon-2.png",
	DragonRed: "dragon-3.png",
	SeasonSpring: "season-1.png",
	SeasonSummer: "season-2.png",
	SeasonAutumn: "season-3.png",
	SeasonWinter: "season-4.png",
	FlowerPlum: "flower-1.png",
	FlowerOrchid: "flower-2.png",
	FlowerChrysanthemum: "flower-3.png",
	FlowerBamboo: "flower-4.png",
};

const ponyAtlas = new Jimp({
	width: atlasSpec.meta.size.w,
	height: atlasSpec.meta.size.h,
	color: 0x00000000,
});

let i = 0;

// 1 for 512x512
// 4 for 2048x2048
const inputScale = 4;

for (let atlasIndex = 0; atlasIndex < tileTypes.length / 16; atlasIndex++) {
	const image = await Jimp.read(
		path.resolve(__dirname, `tbf-pony-remade/${atlasIndex}-shadow.png`),
	);

	for (let y = 0; y < 4; y++) {
		if (i >= tileTypes.length) break;

		for (let x = 0; x < 4; x++) {
			if (i >= tileTypes.length) break;

			const cropped = image.clone().crop({
				x: (128 * x + 42) * inputScale,
				y: y * 128 * inputScale,
				w: (128 - 42) * inputScale,
				h: 128 * inputScale,
			});

			const tileType = tileTypes[i];

			// await Deno.writeFile(
			// 	"out/" + tileType + ".png",
			// 	await cropped.getBuffer("image/png"),
			// );

			const mapping = atlasSpec.frames[atlasMapping[tileType]];

			cropped.scaleToFit({
				w: 175,
				h: 235,
				mode: ResizeStrategy.BICUBIC,
			});

			const xOffset = 30;
			const yOffset = 0;

			ponyAtlas.composite(
				cropped,
				mapping.frame.x + xOffset,
				mapping.frame.y + yOffset,
			);

			i++;
		}
	}
}

// copy atlas tile base

const atlasTileBase = await Jimp.read(
	path.resolve(__dirname, "classic-mahjong/pony-tile-body.png"),
);

ponyAtlas.composite(
	atlasTileBase,
	atlasSpec.frames["tile-body.png"].frame.x,
	atlasSpec.frames["tile-body.png"].frame.y,
);

await Deno.writeFile(
	path.resolve(__dirname, "classic-mahjong/pony-atlas.png"),
	await ponyAtlas.getBuffer("image/png"),
);
