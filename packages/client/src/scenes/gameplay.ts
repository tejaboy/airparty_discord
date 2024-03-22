import { Room } from "colyseus.js";
import { Player } from "../../../server/src/entities/Player";
import { State } from "../../../server/src/entities/State";
import { k } from "../main";
import { getTeamColor } from "./host-waiting";
import { GAME_WIDTH } from "../../../server/src/shared/Constants";
import { GameObj, Vec2 } from "kaboom";

export function createGameplayScene() {
    k.scene("gameplay", (room: Room<State>) => {
        let myPlayer: Player;
        let playerObjects: { [key: string]: GameObj } = {};

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
                // Lerp angle
                let shortestAngle = ((((player.angle - playerSprite.angle) % 360) + 540) % 360) - 180;
                playerSprite.angle = playerSprite.angle + shortestAngle * 12 * k.dt();

                // Lerp position - if distance is too far, then we change immediately (maybe bound?)
                if (player.x == 0 || player.x == GAME_WIDTH) {
                    playerSprite.pos.x = player.x;
                    playerSprite.pos.y = player.y;
                } else {
                    playerSprite.pos.x += (player.x - playerSprite.pos.x) * 12 * k.dt();
                    playerSprite.pos.y += (player.y - playerSprite.pos.y) * 12 * k.dt();
                }
            });

            playerObjects[player.userId] = playerSprite;
        });

        /* MOVEMENT */
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

        // addMessage event
        room.onMessage("addMessage", (message) => {
            addMessage(message);
        })

        // playerDeath event
        room.onMessage("playerDeath", (userId) => {
            let playerSprite: GameObj = playerObjects[userId];
            playerSprite.destroy();
            addExplosion(playerSprite.pos);
        });
    });
}

function addMessage(message: string) {
    k.add([
        k.text(message, { size: 48 }),
        k.pos(k.width() / 2, k.height() * 0.15),
        k.anchor("center"),
        k.color(255, 120, 60),
        k.lifespan(2),
        k.move(-90, 60),
    ])
}

function addExplosion(pos: Vec2, scale: number = 1) {
    // k.addKaboom(pos);

    const explosive = k.add([
        k.sprite("explosion", {
            anim: "explode"
        }),
        k.pos(pos),
        k.anchor("center"),
        k.scale(scale),
        k.stay(),
    ]);

    explosive.onAnimEnd(() => {
        k.destroy(explosive);
    })
}