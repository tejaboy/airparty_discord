import { setUpDiscordSdk } from './helper/setUpDiscordSdk';
import './index.css';
import kaboom from 'kaboom'
import { createHostWaitingScene } from './scenes/host-waiting';
import { createGameplayScene } from './scenes/gameplay';
import { GAME_HEIGHT, GAME_WIDTH } from '../../server/src/shared/Constants';
import { createGameOverScene } from './scenes/gameOver';

// Initialize Kaboom
export const k = kaboom({
	background: "41D9FF",
	width: GAME_WIDTH,
	height: GAME_HEIGHT
});

const text = k.add([
	k.text("Connecting ..."),
	k.pos(k.center()),
	k.anchor("center")
]);

// Load planes
k.loadSprite("plane_1_Blue", "src/images/plane_1_blue.png");
k.loadSprite("plane_2_Blue", "src/images/plane_2_blue.png");
k.loadSprite("plane_3_Blue", "src/images/plane_3_blue.png");
k.loadSprite("plane_1_Red", "src/images/plane_1_red.png");
k.loadSprite("plane_2_Red", "src/images/plane_2_red.png");
k.loadSprite("plane_3_Red", "src/images/plane_3_red.png");

// Load explosion spritesheet
k.loadSprite("explosion", "src/images/explosion.png", {
	sliceX: 3,
	sliceY: 3,
	anims: {
		explode: {
			from: 0,
			to: 8,
			speed: 24
		},
	},
});

// Load bullet sprite
k.loadSprite("bullet1", "src/images/torpedo.png");

// Load logo sprite
k.loadSprite("logo", "src/images/logo.png");

// Load background
k.loadSprite("farground_cloud_1", "src/images/bg/farground_cloud_1.png");
k.loadSprite("mid_ground_cloud_1", "src/images/bg/mid_ground_cloud_1-min.png");
k.loadSprite("cloud-bg", "src/images/bg/mid_ground_cloud_2-min.png");
k.loadSprite("midground_mountains", "src/images/bg/midground_mountains-min.png");

// Create all scenes
createHostWaitingScene();
createGameplayScene();
createGameOverScene();

setUpDiscordSdk().then(({avatarUri, name, client, room}) => {
	text.text = "Set-up succes. Welcome, " + name + "!";
	k.go("host-waiting", room);
});