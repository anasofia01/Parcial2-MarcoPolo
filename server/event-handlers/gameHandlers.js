const { players } = require('../db');
const { assignRoles } = require('../utils/helpers');

const joinGameHandler = (socket, db, io) => {
	return (user) => {
		db.players.push({ id: socket.id, ...user, score: 0 });
		io.emit('userJoined', db);
	};
};

const startGameHandler = (socket, db, io) => {
	return () => {
		db.players = assignRoles(db.players);

		db.players.forEach((element) => {
			io.to(element.id).emit('startGame', element.role);
		});
	};
};

const notifyMarcoHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === 'polo' || user.role === 'polo-especial');

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit('notification', {
				message: 'Marco!!!',
				userId: socket.id,
			});
		});
	};
};

const notifyPoloHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === 'marco');

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit('notification', {
				message: 'Polo!!',
				userId: socket.id,
			});
		});
	};
};

const onSelectPoloHandler = (socket, db, io) => {
	return (userID) => {
		const marco = db.players.find((user) => user.id === socket.id);
		const poloSelected = db.players.find((user) => user.id === userID);
		const poloSpecial = db.players.find((user) => user.role === 'polo-especial');

		if (poloSelected.role === 'polo-especial') {
			marco.score += 50;
			poloSelected.score -= 10;
			io.emit('notifyGameOver', {
				message: `El marco es ${marco.nickname} ha ganado, ${poloSelected.nickname} ha perdido`,
				players: db.players,
			});
		} else {
			marco.score -= 10;
			poloSpecial.score += 10;
			io.emit('notifyGameOver', {
				message: `El marco ${marco.nickname} ha perdido`,
				players: db.players,
			});
		}
		checkedForWinner(io, db.players);
		console.log(db.players);
	};
};

const handleRestartGame = (socket, db, io) => {
	console.log('se reinicia el juego');
	return () => {
		db.players.forEach((player) => {
			player.score = 0;
			player.role = null;
		});
		io.emit('restartGame', db.players);
	};
};

const checkedForWinner = (io, players) => {
	const winner = players.find((player) => player.score >= 100);
	if (winner) {
		const sortedPlayers = players.sort((a, b) => b.score - a.score);
		io.emit('showWinnerScreen', {
			winner: winner.nickname,
			players: sortedPlayers.map((player, index) => ({
				position: index + 1,
				nickname: player.nickname,
				score: player.score,
			})),
		});

		players.forEach((player) => {
			player.score = 0;
			player.role = null;
		});

		io.emit('restartGame', players);
	}
};

module.exports = {
	joinGameHandler,
	startGameHandler,
	notifyMarcoHandler,
	notifyPoloHandler,
	onSelectPoloHandler,
	handleRestartGame,
};
