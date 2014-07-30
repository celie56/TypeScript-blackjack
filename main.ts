
// necessary includes: deck.ts player.ts
// for interface activity include: ui.ts

var deck = new Deck();
var allPlayers = new PlayerContainer();

// basic starting case
allPlayers.addPlayer('user');
allPlayers.firstDeal(deck);
allPlayers.printAll();

