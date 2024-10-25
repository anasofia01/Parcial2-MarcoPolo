const db = require('../db');
const {
	joinGameHandler,
	startGameHandler,
	notifyMarcoHandler,
	notifyPoloHandler,
	onSelectPoloHandler,
	handleRestartGame,
	handleSortAlphabetically,
	checkedHandleRestartGame,
	onGetPlayersList,
} = require('../event-handlers/gameHandlers');

const gameEvents = (socket, io) => {
	socket.on('joinGame', joinGameHandler(socket, db, io));

	socket.on('startGame', startGameHandler(socket, db, io));

	socket.on('notifyMarco', notifyMarcoHandler(socket, db, io));

	socket.on('notifyPolo', notifyPoloHandler(socket, db, io));

	socket.on('onSelectPolo', onSelectPoloHandler(socket, db, io));

	socket.on('restartGame', handleRestartGame(socket, db, io));

	socket.on('sortAlphabetically', handleSortAlphabetically(socket, db, io));

	socket.on('checkedHandleRestartGame', checkedHandleRestartGame(socket, db, io));

	socket.on('getPlayersList', onGetPlayersList(socket, db, io));
};

module.exports = { gameEvents };
