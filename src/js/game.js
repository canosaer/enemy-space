class Game {
     constructor(){
        this.referenceDeck = new Deck()
        this.gameDeck = new Deck()

        this.setupListeners()

        new MessageHandler()
    }

    setupListeners(){
        // document.querySelector(`.title-screen__item_new`).addEventListener(`click`, this.startGame)
        // document.querySelector(`.title-screen__item_instructions`).addEventListener(`click`, this.toggleInstructions)
        // document.querySelector(`.title-screen__item_continue`).addEventListener(`click`, this.continueGame)
    }

    logMessage(message) {
        let evt = new CustomEvent(`message`, {detail: { message: message }})
        document.dispatchEvent(evt)
    }

    startGame = () => {
        console.log(`The game has begun!`)
    }

    toggleInstructions() {
        console.log(`instructions`)
    }

    addCardToBoard(card, facing) {
        const deckEl = document.querySelector(`.deck`)
        const cardEl = card.render(facing)
        deckEl.appendChild(cardEl)
    }

    continueGame() {

    }
}