import {Room, Client} from 'colyseus';
import {TPlayerOptions} from '../entities/Player';
import {State, IState} from '../entities/State';

export class StateHandlerRoom extends Room<State> {
	maxClients = 1000;

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
			this.state.players.forEach((player, sessionId) => {
				// Update player angle based on movement value
				const angleSpeed = 90;
				if (player.movement !== 0) {
					player.angle -= angleSpeed * (player.teamId == 0 ? player.movement : -player.movement) * (deltaTime / 1000);
					player.angle = (player.angle + 360) % 360;
				}
				
				// Auto movement in the direction of player's angle
				const speed = 300;
				player.x += Math.cos(player.angle * Math.PI / 180) * speed * (deltaTime / 1000);
				player.y += Math.sin(player.angle * Math.PI / 180) * speed * (deltaTime / 1000);
			});
		});
	}
}
