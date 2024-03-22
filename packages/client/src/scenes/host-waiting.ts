import { Room } from "colyseus.js";
import { Player } from "../../../server/src/entities/Player";
import { State } from "../../../server/src/entities/State";
import { k } from "../main";
import { addButton } from "../helper/addButton";

export function createHostWaitingScene() {
    k.scene("host-waiting", (room: Room<State>) => {
        let myPlayer: Player;

        const stateChangeController = room.onStateChange((state) => {
            let indexTeam0 = 0;
            let indexTeam1 = 0;
    
            // Remove previous ui
            k.destroyAll("waiting-ui");
    
            // Loop through all players
            state.players.forEach((player: Player, key: string) => {
                if (player.sessionId == room.sessionId) {
                    myPlayer = player;
                }

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

            // Add button to toggle ready state
            addButton(myPlayer.ready ? "UNREADY" : "READY", k.center(), "waiting-ui", (bg, text) => {
                room.send('ready');
            });
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