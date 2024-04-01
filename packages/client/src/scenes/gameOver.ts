import { Room } from "colyseus.js";
import { State } from "../../../server/src/entities/State";
import { k } from "../main";
import { getTeamColor } from "./host-waiting";

export function createGameOverScene() {
    k.scene("gameOver", (room: Room<State>, winnerId: number) => {
        k.setBackground(40, 30, 90);

		// let killfeeds: [string | undefined, string][] = message.killfeeds;

		// Center text to show winner team
		k.add([
			k.text(winnerId != -1 ? `TEAM ${getTeamColor(winnerId)} WIN!` : "TIE", {size: 60}),
			k.pos(k.center()),
			k.anchor("center"),
		]);
    })
}