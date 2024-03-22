import { Room } from "colyseus.js";
import { Player } from "../../../server/src/entities/Player";
import { State } from "../../../server/src/entities/State";
import { k } from "../main";

export function createGameplayScene() {
    k.scene("gameplay", (room: Room<State>) => {
        let myPlayer: Player;
    });
}