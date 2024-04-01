import { Room } from "colyseus.js";
import { State } from "../../../server/src/entities/State";
import { k } from "../main";
import { getTeamColor } from "./host-waiting";
import { GAME_OVER_TIMER } from "../../../server/src/shared/Constants";

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
        
        showKillfeeds(killfeeds);

        // Bottom text to show host restart prompt
        var timer = GAME_OVER_TIMER;
        let restartText = k.add([
			k.text("RESTARTING IN ... " + timer.toString(), {size: 22}),
			k.pos(k.width() / 2, k.height() - 100),
			k.anchor("center"),
		]);

		function startRestartTimer() {
			setTimeout(() => {
				timer -= 1;
	
				if (timer >= 1) {
					startRestartTimer();
                    restartText.text = "RESTARTING IN ... " + timer.toString();
				} else {
                    room.removeAllListeners();
					k.go("host-waiting", room);
				}
			}, 1000);
		}

		startRestartTimer();
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