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
                playerSprite.pos.x += (player.x - playerSprite.pos.x) * 12 * k.dt();
                playerSprite.pos.y += (player.y - playerSprite.pos.y) * 12 * k.dt();
                
                let shortestAngle = ((((player.angle - playerSprite.angle) % 360) + 540) % 360) - 180;
                playerSprite.angle = playerSprite.angle + shortestAngle * 12 * k.dt();
            });
        });

        let currentMovement = 0;
        k.onKeyDown("w", () => {
            setMovement(1);
        });

        k.onKeyRelease("w", () => {
            setMovement(0);
        });

        k.onKeyDown("s", () => {
            setMovement(-1);
        });

        k.onKeyRelease("s", () => {
            setMovement(0);
        });

        function setMovement(value: number) {
            if (currentMovement == value) return;

            currentMovement = value;
            room.send("movement", { value: value });
        }
    });
}