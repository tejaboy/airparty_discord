import { Room } from "colyseus.js";
import { State } from "../../../server/src/entities/State";
import { k } from "../main";
import { getTeamColor } from "./host-waiting";

export function createGameOverScene() {
    k.scene("gameOver", (room: Room<State>, winnerId: number, killfeeds: [string | undefined, string][]) => {
        k.setBackground(40, 30, 90);

		// let killfeeds: [string | undefined, string][] = message.killfeeds;

		// Center text to show winner team
		k.add([
			k.text(winnerId != -1 ? `TEAM ${getTeamColor(winnerId)} WIN!` : "TIE", {size: 60}),
			k.pos(k.center()),
			k.anchor("center"),
		]);

        console.log(killfeeds);
        showKillfeeds(killfeeds);
    })
}

function showKillfeeds(killfeeds: [string | undefined, string][]) {
    let index = 0;
    for (let killfeed of killfeeds) {
        let killer = killfeed[0];
        let victim = killfeed[1];

        k.add([
            k.text(killer != null ? `${killer} killed ${victim}` : `${victim} crashed`, {size: 22}),
            k.pos(k.width() * 0.9, k.height() * 0.1 + (26 * index++)),
            k.anchor("right"),
        ]);
    }
}