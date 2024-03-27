import {Room, Client} from 'colyseus';
import {Player, TPlayerOptions} from '../entities/Player';
import {State, IState} from '../entities/State';
import { BULLET_INTERVAL, BULLET_SPEED, GAME_HEIGHT, GAME_WIDTH, PLAYER_HEIGHT, PLAYER_WIDTH, PROJECTILE_HEIGHT, PROJECTILE_WIDTH } from '../shared/Constants';

export class StateHandlerRoom extends Room<State> {
	maxClients = 1000;
	private projectiles: Projectile[] = [];

	onCreate(options: IState) {
		this.setState(new State(options));

		// Here's where we would add handlers for updating state
		this.onMessage('startTalking', (client, _data) => {
			this.state.startTalking(client.sessionId);
		});

		this.onMessage('stopTalking', (client, _data) => {
			this.state.stopTalking(client.sessionId);
		});

		this.onMessage('ready', (client, _data) => {
			this.state.setPlayerReady(client.sessionId);

			// Check if all players are ready, if not, set allReady to false
			let allReady = true;
			this.state.players.forEach((player, sessionId) => {
				if (!player.ready) {
					allReady = false;
					return;
				}
			})

			// If all players are ready, we send the start signal to all client
			if (allReady) {
				this.broadcast("start-game");
				this.startGame();
			}
		});

		this.onMessage('movement', (client, data) => {
			this.state.setMovement(client.sessionId, data.value);
		});

		this.onMessage('shooting', (client, isShooting) => {
			this.state.setShooting(client.sessionId, isShooting);
		});
	}

	onAuth(_client: any, _options: any, _req: any) {
		return true;
	}

	onJoin(client: Client, options: TPlayerOptions) {
		this.state.createPlayer(client.sessionId, options);
	}

	onLeave(client: Client) {
		this.state.removePlayer(client.sessionId);
	}

	onDispose() {
		console.log('Dispose StateHandlerRoom');
	}

	// Gameplay Loop
	startGame() {
		this.setSimulationInterval((deltaTime) => {
			/* Player Loop */
			this.state.players.forEach((player, sessionId) => {
				if (player.health <= 0) {
					return;
				}

				// Update player angle based on movement value
				const angleSpeed = 90;
				if (player.movement !== 0) {
					player.angle -= angleSpeed * (player.teamId == 0 ? player.movement : -player.movement) * (deltaTime / 1000);
					player.angle = (player.angle + 360) % 360;
				}

				// Auto movement in the direction of player's angle
				const speed = 300;
				const nextX = Math.cos(player.angle * Math.PI / 180) * speed * (deltaTime / 1000);
				const nextY = Math.sin(player.angle * Math.PI / 180) * speed * (deltaTime / 1000);
				if (player.teamId == 0) {
					player.x += nextX;
					player.y += nextY;
				} else {
					player.x -= nextX;
					player.y -= nextY;
				}

				/* BOUNDS */
                // When reaches end, restart at 0
                if (player.x > GAME_WIDTH) {
                    player.x = 0;
                } else if (player.x < 0) {
                    player.x = GAME_WIDTH;
                }

				// When hit height or ground, lose the game
                if (player.y > GAME_HEIGHT || player.y < 0) {
                    //killfeeds.push([undefined, serverPlayer.name]);
                	this.broadcast("addMessage", `${player.name} crashed!`);
                    this.damagePlayer(player, 100);
                }

				/* SHOOT */
				player.bulletTimer += deltaTime / 1000;
				if (player.isShooting && player.bulletTimer > BULLET_INTERVAL && player.bulletLeft > 0) {
					player.bulletTimer = 0;
					let projectile: Projectile = {
						x: player.x,
						y: player.y,
						angle: player.teamId == 0 ? player.angle : (player.angle - 180) % 360,
						targetTeamId: player.teamId == 0 ? 1 : 0,
						owner: player.name,
						id: "projectile#" + this.projectiles.length + "-" + Math.random().toString(16).slice(2)
					}

					this.broadcast("createProjectile", projectile);
					this.createProjectileOnServer(projectile);
				}
			});

			/* Projectile Loop */
			this.projectiles = this.projectiles.filter((projectile) => {
				projectile.x += Math.cos(projectile.angle * Math.PI / 180) * BULLET_SPEED * (deltaTime / 1000);
				projectile.y += Math.sin(projectile.angle * Math.PI / 180) * BULLET_SPEED * (deltaTime / 1000);
			
				// Projectile bounds
				if (projectile.x > GAME_WIDTH || projectile.x < 0 || projectile.y < 0 || projectile.y > GAME_HEIGHT) {
					this.broadcast("removeProjectile", projectile.id);
					return false; // Remove this projectile from array
				}

				// Projectile hit player
				this.state.players.forEach((player, sessionId) => {
					if (projectile.targetTeamId != player.teamId) return;

					// Check for collision between projectile and player
					const projectileCenterX = projectile.x + PROJECTILE_WIDTH / 2;
					const projectileCenterY = projectile.y + PROJECTILE_HEIGHT / 2;

					// Calculate center position of player
					const playerCenterX = player.x + PLAYER_WIDTH / 2;
					const playerCenterY = player.y + PLAYER_HEIGHT / 2;

					// Calculate half-width and half-height of player and projectile
					const halfPlayerWidth = PLAYER_WIDTH / 2;
					const halfPlayerHeight = PLAYER_HEIGHT / 2;
					const halfProjectileWidth = PROJECTILE_WIDTH / 2;
					const halfProjectileHeight = PROJECTILE_HEIGHT / 2;

					// Check for collision between projectile and player
					if (Math.abs(projectileCenterX - playerCenterX) < halfPlayerWidth + halfProjectileWidth &&
						Math.abs(projectileCenterY - playerCenterY) < halfPlayerHeight + halfProjectileHeight) {
						
						console.log("Collision detected with player:", player.name);
						this.broadcast("removeProjectile", projectile.id);
						return false;
					}
				});
				
				return true; // Keep this projectile in the array
			});
		});
	}

	damagePlayer(player: Player, damage: number) {
		player.health -= damage;

		if (player.health <= 0) {
			this.broadcast("playerDeath", player.userId);
		}
	}

	createProjectileOnServer(projectile: Projectile) {
		this.projectiles.push(projectile);
	}
}

interface Projectile {
    x: number;
    y: number;
    angle: number;
    targetTeamId: number;
    owner: string;
	id: string;
}