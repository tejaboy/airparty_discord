import {Schema, MapSchema, type} from '@colyseus/schema';
import {TPlayerOptions, Player} from './Player';
import { GAME_WIDTH } from '../shared/Constants';

export interface IState {
	roomName: string;
	channelId: string;
}

export class State extends Schema {
	@type({map: Player})
	players = new MapSchema<Player>();

	@type('string')
	public roomName: string;

	@type('string')
	public channelId: string;

	serverAttribute = 'this attribute wont be sent to the client-side';

	// Init
	constructor(attributes: IState) {
		super();
		this.roomName = attributes.roomName;
		this.channelId = attributes.channelId;
	}

	private _getPlayer(sessionId: string): Player | undefined {
		return Array.from(this.players.values()).find((p) => p.sessionId === sessionId);
	}

	createPlayer(sessionId: string, playerOptions: TPlayerOptions) {
		const existingPlayer = Array.from(this.players.values()).find((p) => p.sessionId === sessionId);
		const teamId = this.countPlayersInTeam(0) > this.countPlayersInTeam(1) ? 1 : 0;
		const x = teamId == 0 ? 100 : GAME_WIDTH - 100;
		const y = 200 + (90 * this.countPlayersInTeam(teamId));

		if (existingPlayer == null) {
			this.players.set(playerOptions.userId, new Player({
				...playerOptions,
				sessionId,
				teamId,
				spriteId: Math.floor(Math.random() * 3) + 1,
				x,
				y
			}));
		}
	}

	removePlayer(sessionId: string) {
		const player = Array.from(this.players.values()).find((p) => p.sessionId === sessionId);
		if (player != null) {
			this.players.delete(player.userId);
		}
	}

	startTalking(sessionId: string) {
		const player = this._getPlayer(sessionId);
		if (player != null) {
			player.talking = true;
		}
	}

	stopTalking(sessionId: string) {
		const player = this._getPlayer(sessionId);
		if (player != null) {
			player.talking = false;
		}
	}

	setPlayerReady(sessionId: string) {
		const player = this._getPlayer(sessionId);
		if (player != null) {
			player.ready = !player.ready;
		}
	}

	countPlayersInTeam(teamIdToCount: number): number {
		let count = 0;
		for (const player of this.players.values()) {
			if (player.teamId === teamIdToCount) {
				count++; // Increment count if the player's teamId matches the specified teamId
			}
		}
		return count;
	}
}
