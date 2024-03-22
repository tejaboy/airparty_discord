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
		})
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
				const speed = 300;

				player.x += Math.cos(player.angle) * speed * (deltaTime / 1000);
				player.y += Math.sin(player.angle) * speed * (deltaTime / 1000);
			});
		});
	}
}
