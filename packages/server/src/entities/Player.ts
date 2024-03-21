import {Schema, type} from '@colyseus/schema';

export type TPlayerOptions = Pick<Player, 'sessionId' | 'userId' | 'name' | 'avatarUri' | 'talking' | 'spriteId' | 'teamId'>;

export class Player extends Schema {
  @type('string')
  public sessionId: string;

  @type('string')
  public userId: string;

  @type('string')
  public avatarUri: string;

  @type('string')
  public name: string;

  @type('boolean')
  public talking: boolean = false;

  @type("boolean")
  public ready: boolean = false;

  @type("number")
  public bulletLeft: number = 60;

  @type("number")
  public reloadTimer: number = 0;

  @type("number")
  public teamId: number = 0;

  @type("number")
  public spriteId: number = 1;

  // Init
  constructor({name, userId, avatarUri, sessionId, teamId, spriteId}: TPlayerOptions) {
    super();
    this.userId = userId;
    this.avatarUri = avatarUri;
    this.name = name;
    this.sessionId = sessionId;
    this.teamId = teamId;
    this.spriteId = spriteId;
  }
}
