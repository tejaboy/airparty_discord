import { setUpDiscordSdk } from './helper/setUpDiscordSdk';
import './index.css';
import kaboom from 'kaboom'

// Initialize Kaboom
export const k = kaboom({
	background: "41D9FF"
});

const text = k.add([
	k.text("Connecting ..."),
	k.pos(k.center()),
	k.anchor("center")
]);

setUpDiscordSdk().then(({avatarUri, name, client, room}) => {
	text.text = "Set-up succes. Welcome, " + name + "!";
});