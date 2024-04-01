import {Schema, type} from '@colyseus/schema';
import { BULLET_INTERVAL, BULLET_MAG_SIZE, PLAYER_INITIAL_HEALTH } from '../shared/Constants';

export type TPlayerOptions = Pick<Player, 'sessionId' | 'userId' | 'name' | 'avatarUri' | 'spriteId' | 'teamId' | 'x' | 'y'>;

export class Player extends Schema {
	@type('string')
	public sessionId: string;

	@type('string')
	public userId: string;

	@type('string')
	public avatarUri: string;

	@type('string')
	public name: string;

	@type("boolean")
	public ready: boolean = false;

	@type("boolean")
	public isShooting: boolean = false;

	@type("number")
	public bulletTimer: number = BULLET_INTERVAL; // interval between each shot

	@type("number")
	public bulletLeft: number = BULLET_MAG_SIZE;

	@type("number")
	public reloadTimer: number = 0;

	@type("number")
	public teamId: number = 0;

	@type("number")
	public spriteId: number = 1;

	@type("number")
	public x: number = 0;

	@type("number")
	public y: number = 0;

	@type("number")
	public angle: number = 0;

	@type("number")
	public movement: number = 0; // 0 == no move, 1 == move up, -1 == move down

	@type("number")
	public health: number = PLAYER_INITIAL_HEALTH;

	// Init
	constructor({name, userId, avatarUri, sessionId, teamId, spriteId, x, y}: TPlayerOptions) {
		super();
		this.userId = userId;
		this.avatarUri = avatarUri;
		this.name = name;
		this.sessionId = sessionId;
		this.teamId = teamId;
		this.spriteId = spriteId;
		this.x = x;
		this.y = y;
	}
}
