import { Room } from "colyseus.js";
import { Player } from "../../../server/src/entities/Player";
import { State } from "../../../server/src/entities/State";
import { k } from "../App";
import { addButton } from "../helper/addButton";
import { GameObj } from "kaboom";

export function createHostWaitingScene() {
    k.scene("host-waiting", (room: Room<State>) => {
        addParallaxBackground();

        k.add([
			k.sprite("logo"),
			k.pos(k.width() / 2, k.height() * 0.2),
			k.anchor("center"),
		]);

        updateLobby();
        const stateChangeController = room.onStateChange((state) => {
            updateLobby();
        });

        function updateLobby() {
            // Remove previous ui
            k.destroyAll("waiting-ui");
        
            // Loop through all players
            room.state.players.forEach((player: Player, key: string) => {
                k.loadSprite("player_" + player.name, player.avatarUri);
        
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
                    k.pos(player.x, player.y),
                    k.anchor("center"),
                    k.rotate(0),
                    "waiting-ui"
                ]);
        
                // Add player avatar
                playerSprite.add([
                    k.sprite("player_" + player.name),
                    k.pos(6, -16),
                    k.anchor("center"),
                    k.scale(0.1),
                    "waiting-ui"
                ])
        
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
                    k.pos(0, 10),
                    k.anchor("center"),
                    "waiting-ui"
                ]);
            });
        }

        // Add button to toggle ready state
        addButton("READY", k.center(), "", (bg, text) => {
            room.send('ready');
            text.text = text.text == "READY" ? "UNREADY" : "READY"
        });

        // On start-game-countdown message
        room.onMessage("countdown", (message) => {
            k.add([
                k.text(message, { size: 48 }),
                k.pos(k.width() / 2, k.height() * 0.75),
                k.anchor("center"),
                k.color(255, 120, 60),
                k.lifespan(0.8, {fade: 0.2}),
                k.opacity(1),
                k.move(90, 60),
            ]);
        });
        
        // On start-game message
        room.onMessage("start-game", () => {
            stateChangeController.clear();
            room.removeAllListeners();
            k.go("gameplay", room);
        });
    });
}

export function getTeamColor(teamId: number) {
    return teamId == 0 ? "Blue" : "Red";
}

export function addParallaxBackground() {
	const SPEED = 100;

	k.setBackground(65, 217, 255);

	k.add([
		k.sprite("farground_cloud_1"),
		k.pos(0, 40),
		k.z(0)
	]);

	// Mid Cloud
	const midGroundCloud1 = k.add([
		k.sprite("mid_ground_cloud_1"),
		k.pos(0, k.height() - 900),
		k.move(0, -SPEED),
		k.z(0)
	]);

	const midGroundCloud2 = k.add([
		k.sprite("mid_ground_cloud_1"),
		k.pos(2048, k.height() - 900),
		k.move(0, -SPEED),
		k.z(0)
	]);

	midGroundCloud1.onUpdate(midResetBg.bind(midGroundCloud1));
	midGroundCloud2.onUpdate(midResetBg.bind(midGroundCloud2));

	function midResetBg(this: GameObj) {
		if (this.pos.x <= -2048) {
			this.pos.x = k.width();
		}
	}

	// Top cloud
	const cloud1 = k.add([
		k.sprite("cloud-bg"),
		k.pos(0, k.height() - 474),
		k.move(0, SPEED),
		k.z(0)
	]);

	const cloud2 = k.add([
		k.sprite("cloud-bg"),
		k.pos(-2048, k.height() - 474),
		k.move(0, SPEED),
		k.z(0)
	]);

    /*
	k.add([
		k.sprite("midground_mountains"),
		k.pos(0, k.height() - 119),
		k.z(0)
	])
    */

	cloud1.onUpdate(resetBg.bind(cloud1));
	cloud2.onUpdate(resetBg.bind(cloud2));

	function resetBg(this: GameObj) {
		if (this.pos.x > k.width()) {
			this.pos.x = -2048;
		}
	}
}