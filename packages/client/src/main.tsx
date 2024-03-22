import { setUpDiscordSdk } from './helper/setUpDiscordSdk';
import './index.css';
import kaboom from 'kaboom'
import { createHostWaitingScene } from './scenes/host-waiting';
import { createGameplayScene } from './scenes/gameplay';
import { GAME_HEIGHT, GAME_WIDTH } from '../../server/src/shared/Constants';

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

// Create all scenes
createHostWaitingScene();
createGameplayScene();

setUpDiscordSdk().then(({avatarUri, name, client, room}) => {
	text.text = "Set-up succes. Welcome, " + name + "!";
	k.go("host-waiting", room);
});