var Card = (function () {
    function Card(i) {
        var s = "null";
        switch (Math.floor(i / 13)) {
            case 0:
                s = "Hearts";
                break;
            case 1:
                s = "Diamonds";
                break;
            case 2:
                s = "Spades";
                break;
            case 3:
                s = "Clubs";
                break;
        }
        this.suit = s;
        this.value = Math.floor(i % 13);
    }
    Card.prototype.val = function () {
        if (this.value < 9)
            return (this.value + 2).toString();
        else
            switch (this.value) {
                case 9:
                    return "Jack";
                case 10:
                    return "Queen";
                case 11:
                    return "King";
                case 12:
                    return "Ace";
            }
    };
    Card.prototype.valNum = function () {
        return (this.value < 9) ? this.value + 2 : 10;
    };
    return Card;
})();
var Deck = (function () {
    function Deck() {
        this.data = [];
        this.currentCard = 0;
        for (var i = 0; i < 52; i++) {
            this.data.push(new Card(i));
        }
        this.shuffle();
    }
    Deck.prototype.printAll = function () {
        this.data.forEach(function (c) {
            console.log(c.suit + " " + c.value);
        });
    };
    Deck.prototype.shuffle = function () {
        for (var j, x, i = this.data.length; i; j = Math.floor(Math.random() * i), x = this.data[--i], this.data[i] = this.data[j], this.data[j] = x)
            ;
        this.currentCard = 0;
    };
    Deck.prototype.deal = function () {
        return this.data[this.currentCard++];
    };
    return Deck;
})();
// This is a single player class, it shall hold all info
// specific to that player
var Player = (function () {
    function Player(s) {
        this.hand = []; // and their hands, cool
        this.name = s;
        this.emptyHand();
    }
    Player.prototype.addCard = function (c) {
        this.hand.push(c);
    };
    Player.prototype.emptyHand = function () {
        this.hand = [];
    };
    Player.prototype.printHand = function (i) {
        console.log(this.name + " has: " + this.score());
        for (; i < this.hand.length; i++)
            console.log(this.hand[i].val() + " of " + this.hand[i].suit);
    };
    Player.prototype.score = function () {
        var output = 0;
        var numAces = 0;
        this.hand.forEach(function (c) {
            if (c.val() == "Ace")
                numAces++;
            else
                output += c.valNum();
        });
        for (; numAces > 0; numAces--) {
            output += (output + 10 + numAces - 1 <= 21) ? 10 : 1;
        }
        return output;
    };
    return Player;
})();
// This container shall hold all current players and will
// handle information for all of them
var PlayerContainer = (function () {
    function PlayerContainer() {
        this.data = []; // who's playing?
        this.addPlayer('Dealer');
    }
    PlayerContainer.prototype.addPlayer = function (s) {
        this.data.push(new Player(s));
    };
    PlayerContainer.prototype.getPlayer = function (i) {
        return this.data[i];
    };
    PlayerContainer.prototype.firstDeal = function (d) {
        for (var i = this.data.length - 1; i > 0; i--) {
            this.data[i].addCard(d.deal());
            this.data[i].addCard(d.deal());
        }
        this.data[0].addCard(d.deal());
    };
    PlayerContainer.prototype.printAll = function () {
        this.data.forEach(function (p) {
            p.printHand(0);
        });
    };
    return PlayerContainer;
})();
// necessary includes: deck.ts player.ts
// for interface activity include: ui.ts
var deck = new Deck();
var allPlayers = new PlayerContainer();
// basic starting case
allPlayers.addPlayer('user');
allPlayers.firstDeal(deck);
allPlayers.printAll();
function activate(element) {
    element.className = "btn active";
}
function deactivate(element) {
    element.className = "btn disabled";
}
function updateUI() {
    document.getElementById('dealerscore').innerHTML = "Dealer has: " + allPlayers.getPlayer(0).score().toString();
    var dealercards = document.getElementById('dealercards');
    dealercards.innerHTML = "";
    allPlayers.getPlayer(0).hand.forEach(function (c) {
        console.log("<img src=\"images/" + c.val().toString().toLowerCase() + "_of_" + c.suit.toLowerCase() + ".png\">");
        dealercards.innerHTML += "<img src=\"images/" + c.val().toString().toLowerCase() + "_of_" + c.suit.toLowerCase() + ".png\" width=\"130\" height=\"150\">";
        //dealercards.innerHTML += "<p>" + c.val() + " of " + c.suit + "</p>";
    });
    document.getElementById('userscore').innerHTML = "User has: " + allPlayers.getPlayer(1).score().toString();
    var usercards = document.getElementById('usercards');
    usercards.innerHTML = "";
    allPlayers.getPlayer(1).hand.forEach(function (c) {
        //usercards.innerHTML += "<p>" + c.val() + " of " + c.suit + "</p>";
        usercards.innerHTML += "<img src=\"images/" + c.val().toString().toLowerCase() + "_of_" + c.suit.toLowerCase() + ".png\" width=\"130\" height=\"150\">";
    });
}
function hitThat() {
    if (hitButton.className == "btn active") {
        allPlayers.getPlayer(1).addCard(deck.deal());
        allPlayers.getPlayer(1).printHand(0);
        updateUI();
        if (allPlayers.getPlayer(1).score() > 21)
            endGame();
    }
}
function stayThere() {
    if (stayButton.className == "btn active") {
        endGame();
    }
}
// while this function isn't necessarily part of ui,
// it relies on ui functions and shouldn't be included
// in the build if I'm not testing ui
function newgame() {
    deck = new Deck();
    allPlayers = new PlayerContainer();
    allPlayers.addPlayer('user');
    allPlayers.firstDeal(deck);
    updateUI();
    activate(hitButton);
    activate(stayButton);
    document.getElementById('output').innerHTML = "";
}
function endGame() {
    deactivate(hitButton);
    deactivate(stayButton);
    var outputtext = "";
    if (allPlayers.getPlayer(1).score() > 21)
        outputtext = "you bust";
    else {
        while (allPlayers.getPlayer(0).score() < 15 && allPlayers.getPlayer(0).score() < allPlayers.getPlayer(1).score())
            allPlayers.getPlayer(0).addCard(deck.deal());
        updateUI();
        if (allPlayers.getPlayer(0).score() > 21)
            outputtext = "dealer busts, you win";
        else if (allPlayers.getPlayer(1).hand.length > 4)
            outputtext = "My but what a large hand you have, you win.";
        else if (allPlayers.getPlayer(0).score() >= allPlayers.getPlayer(1).score())
            outputtext = "dealer wins";
        else
            outputtext = "you win!";
    }
    document.getElementById("output").innerHTML = "<p>" + outputtext + "</p><button class='btn active' onclick='newgame()'>New Game?</button>";
}
// button work
var hitButton = document.getElementById('hitButton');
activate(hitButton);
hitButton.onclick = hitThat;
var stayButton = document.getElementById('stayButton');
activate(stayButton);
stayButton.onclick = stayThere;
// first run ui
updateUI();
