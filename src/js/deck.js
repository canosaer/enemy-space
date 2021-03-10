class Deck {
    constructor() {
        
        this.create()

    }

    create() {
        this.cards = [
            {title: `Heavy Missiles`, size: 1, cost: 200, attack: 5, counter: 4, image: `../../src/img/components/heavy_missiles.png`},
            {title: `Light Missiles`, size: 0.5, cost: 100, attack: 2, counter: 4, image: `../../src/img/components/light_missiles.png`},
            {title: `Gauss Cannon`, size: 5, cost: 1500, attack: 12, image: `../../src/img/components/gauss_cannon.png`},
            {title: `Blaster Cannon`, size: 4, cost: 1000, attack: 8, image: `../../src/img/components/blaster_cannon.png`},
            {title: `Particle Beam`, size: 3, cost: 500, attack: 5, image: `../../src/img/components/particle_beam.png`},
            {title: `Auto Cannon`, size: 1, cost: 100, attack: 1, image: `../../src/img/components/auto_cannon.png`},
            {title: `Countermeasures`, size: 0.5, cost: 30, image: `../../src/img/components/countermeasures.png`},
            {title: `Armor`, size: 0.5, cost: 30, image: `../../src/img/components/countermeasures.jpg`},
            {title: `Artificial Intelligence`, size: 1, cost: 300, image: `../../src/img/components/artificial_intelligence.png`},
            {title: `Missile Launcher`, size: 1, cost: 300, image: `../../src/img/components/missile_launcher.png`},
            {title: `Shields`, size: 3, cost: 150, image: `../../src/img/components/shields.png`},
            {title: `Engine Upgrade`, size: 1, cost: 300, image: `../../src/img/components/engine_upgrade.png`},
            {title: `Stealth System`, size: 2, cost: 300, image: `../../src/img/components/stealth_system.png`},
            {title: `Targeting System`, size: 1, cost: 150, image: `../../src/img/components/targeting_system.png`},
        ]
    }

    shuffle() {                      //https://bost.ocks.org/mike/shuffle/
        var m = this.cards.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = this.cards[m];
            this.cards[m] = this.cards[i];
            this.cards[i] = t;
        }

        return this.cards;
    }

    reset() {
        this.create()
    }

    reveal(numCards) {
        let returnCards = []
        for(let i=0;i<numCards;i++){
            returnCards.push(this.cards.pop())
        }
        return returnCards
        
    }
}