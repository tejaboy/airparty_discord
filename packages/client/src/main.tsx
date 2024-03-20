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

// Load planes
k.loadSprite("plane_1_Blue", "src/images/plane_1_blue.png");
k.loadSprite("plane_2_Blue", "src/images/plane_2_blue.png");
k.loadSprite("plane_3_Blue", "src/images/plane_3_blue.png");
k.loadSprite("plane_1_Red", "src/images/plane_1_red.png");
k.loadSprite("plane_2_Red", "src/images/plane_2_red.png");
k.loadSprite("plane_3_Red", "src/images/plane_3_red.png");

setUpDiscordSdk().then(({avatarUri, name, client, room}) => {
	text.text = "Set-up succes. Welcome, " + name + "!";
	
	room.onStateChange((state) => {
		let indexTeam0 = 0;
		let indexTeam1 = 0;
		
		// Remove previous ui
		k.destroyAll("waiting-ui");

		// Loop through all players
		state.players.forEach((player: Player, key: string) => {
			// Log information
			console.log(`Player ID: ${key}`);
			console.log(`Name: ${player.name}`);
			console.log(`User ID: ${player.userId}`);
			console.log(`Avatar URI: ${player.avatarUri}`);
			console.log(`Session ID: ${player.sessionId}`);
			console.log("------------");

			// Add player plane
			const playerSprite = k.add([
				// List of components, each offers a set of functionalities
				k.sprite(`plane_${player.spriteId}_${getTeamColor(player.teamId)}`, { flipX: player.teamId != 0}),
				player.teamId == 0 ? k.pos(100, 200 + (150 * indexTeam0++)) : k.pos(k.width() - 100, 200 + (150 * indexTeam1++)),
				k.area(),
				k.health(8),
				k.anchor("center"),
				k.rotate(0),
				"waiting-ui"
			]);

			// Add player name
			playerSprite.add([
				k.text(player.name, {size: 12}),
				k.pos(0, 0),
				k.anchor("center"),
				"waiting-ui"
			]);

			// Show ready state
			playerSprite.add([
				k.text(player.ready ? "READY" : "NOT READY", {size: 12}),
				player.ready ? k.color(0, 255, 0) : k.color(255, 0, 0),
				k.pos(0, 20),
				k.anchor("center"),
				"waiting-ui"
			]);
		});
	})
});

export function getTeamColor(teamId: number) {
    return teamId == 0 ? "Blue" : "Red";
}