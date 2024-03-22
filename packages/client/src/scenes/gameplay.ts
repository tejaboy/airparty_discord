import { Room } from "colyseus.js";
import { Player } from "../../../server/src/entities/Player";
import { State } from "../../../server/src/entities/State";
import { k } from "../main";
import { getTeamColor } from "./host-waiting";

export function createGameplayScene() {
    k.scene("gameplay", (room: Room<State>) => {
        let myPlayer: Player;

        room.state.players.forEach((player, sessionId) => {
            if (player.sessionId == room.sessionId) {
                myPlayer = player;
            }

            // Add player plane
            const playerSprite = k.add([
                // List of components, each offers a set of functionalities
                k.sprite(`plane_${player.spriteId}_${getTeamColor(player.teamId)}`, { flipX: player.teamId != 0}),
                k.pos(player.x, player.y),
                k.anchor("center"),
                k.rotate(0),
            ]);

            // Add player avatar
            playerSprite.add([
                k.sprite("player_" + player.name),
                k.pos(6, -16),
                k.anchor("center"),
                k.scale(0.1),
            ]);

            playerSprite.onUpdate(() => {
                playerSprite.pos.x += (player.x - playerSprite.pos.x) * 1 * k.dt();
                playerSprite.pos.y += (player.y - playerSprite.pos.y) * 1 * k.dt();
                playerSprite.angle += (player.angle - playerSprite.angle) * 1 * k.dt();
            });
        });
    });
}