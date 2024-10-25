import { router, socket } from '../routes.js';

export default function renderScreen1() {
	const app = document.getElementById('app');
	app.innerHTML = `
    <h1>GAME RESULTS</h1>
    <div id="winnerMessage"></div>
    <ul id="playerList"></ul>
    <button id="sortButton">Sort Alphabetically</button>
  `;

	socket.emit('getPlayerList');

	socket.on('playerList', (data) => {
		const { players } = data;
		renderPlayerList(players);
	});

	socket.on('userJoined', (data) => {
		const { players } = data;
		renderPlayerList(players);
	});

	socket.on('updatePlayerList', (data) => {
		const { players } = data;
		renderPlayerList(players);
	});

	socket.on('showWinnerScreen', (data) => {
		const { winner, players } = data;
		alert(`¡${winner} ha ganado!`);
		renderPlayerList(players);
	});

	socket.on('notifyGameOver', (data) => {
		const { players } = data;
		renderPlayerList(players);
	});

	socket.on('restartGame', (players) => {
		renderPlayerList(players);
	});

	document.getElementById('sortButton').addEventListener('click', () => {
		socket.emit('sortAlphabetically');
	});

	function renderPlayerList(players) {
		const playerList = document.getElementById('playerList');
		playerList.innerHTML = players
			.map((player, index) => {
				const positionText = player.position !== undefined ? `${player.position}. ` : '';
				return `
				<li>
					${positionText}${player.nickname} (${player.score} pts)
				</li>`;
			})
			.join('');
	}
}
