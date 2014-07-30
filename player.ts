
// This is a single player class, it shall hold all info
// specific to that player
class Player{
	name: string; 			// let's have a unique name please
	hand: Card[] = []; 		// and their hands, cool
	constructor(s: string){
		this.name = s;
		this.emptyHand();
	}
	addCard(c: Card){ 		// you deserve to receive a card
		this.hand.push(c);
	}
	emptyHand(){ 			// you ain't got nothin'
		this.hand = [];
	}
	printHand(i: number){ 	// I want to know what you have in your hand
		console.log(this.name + " has: " + this.score());
		for (; i < this.hand.length; i++)
			console.log(
					this.hand[i].val() + 
					" of " +
					this.hand[i].suit
					);
	}
	score(): number{ 		// Let's tally that score for you
		var output: number = 0;
		var numAces: number = 0;
		this.hand.forEach(function(c: Card){
			if (c.val() == "Ace") numAces++;
			else output += c.valNum();
		});
		for (;numAces > 0; numAces--){
			output += (output + 10 + numAces - 1 <= 21) ? 10 : 1;
		}
		return output;
	}
}

// This container shall hold all current players and will
// handle information for all of them
class PlayerContainer{
	data: Player[] = []; 	// who's playing?
	constructor(){
		this.addPlayer('Dealer');
	}
	addPlayer(s: string){ 	// challenger approaching
		this.data.push(new Player(s));
	}
	getPlayer(i: number): Player{
		return this.data[i];
	}
	firstDeal(d: Deck){
		for (var i = this.data.length - 1; i > 0; i--){
			this.data[i].addCard(d.deal());
			this.data[i].addCard(d.deal());
		}
		this.data[0].addCard(d.deal());
	}
	printAll(){
		this.data.forEach(function(p){
			p.printHand(0);
		});
	}
}
