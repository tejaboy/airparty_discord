import { Player } from '../../server/src/entities/Player';
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

	room.onStateChange((state) => {
		state.players.forEach((player: Player, key: string) => {
			console.log(`Player ID: ${key}`);
			console.log(`Name: ${player.name}`);
			console.log(`User ID: ${player.userId}`);
			console.log(`Avatar URI: ${player.avatarUri}`);
			console.log(`Session ID: ${player.sessionId}`);
			console.log("------------");
		});
	})
});