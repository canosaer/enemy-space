class Game {
     constructor(){
        this.referenceDeck = new Deck()
        this.gameDeck = new Deck()
        this.player = new Player()
            

        this.setupListeners()
        new MessageHandler()

        this.setupShip()
        this.setupCrew()
    }

    setupListeners(){
        document.querySelector(`.game-display__title`).addEventListener(`click`, this.returnToTitle)
        document.querySelector(`.game-display__subtitle`).addEventListener(`click`, this.returnToTitle)
        document.addEventListener(`removeCrewListeners`, this.toggleCrewListeners)
        document.addEventListener(`advancePhase`, this.advancePhase)
    }

    returnToTitle() {
        localStorage.setItem('dm21GameState', `paused`)
        document.querySelector(`.title-screen`).classList.remove(`hidden`)
        document.querySelector(`.game-display`).classList.add(`hidden`)
    }

    setupShip = () => {
        this.player.components.installed = [
            this.referenceDeck.cards[5],
            this.referenceDeck.cards[6],
            this.referenceDeck.cards[9],
            this.referenceDeck.cards[1]
        ]
        let evt = new CustomEvent(`renderInstalledComponents`)
        document.dispatchEvent(evt)   
    }

    setupCrew = () => {
        this.logMessage(`Select Crew: Under "Crew," click on your Pilot, Gunner, or Engineer to add a +2 bonus to that crew member.`)
        sessionStorage.setItem('dm21IncreaseLevel', `2`)
        sessionStorage.setItem('dm21GamePhase', `crewSetup`)
        this.toggleCrewListeners()
    }

    advancePhase = (evt) => {
        let gamePhase = sessionStorage.getItem('dm21GamePhase')
        if(gamePhase === `crewSetup`){
            sessionStorage.setItem('dm21GamePhase', `playerTurn`)
            this.playerTurn()
        }
    }

    toggleCrewListeners = () => {
        crewElements.forEach(element => {
            element.classList.toggle(`clickable`)
        });
        if(crewElements[0].classList.contains(`clickable`)){
            crewContainer.querySelector(`.crew__pilot`).addEventListener(`click`, this.increasePilot )
            crewContainer.querySelector(`.crew__gunner`).addEventListener(`click`, this.increaseGunner )
            crewContainer.querySelector(`.crew__engineer`).addEventListener(`click`, this.increaseEngineer )
        }
        else{
            crewContainer.querySelector(`.crew__pilot`).removeEventListener(`click`, this.increasePilot )
            crewContainer.querySelector(`.crew__gunner`).removeEventListener(`click`, this.increaseGunner )
            crewContainer.querySelector(`.crew__engineer`).removeEventListener(`click`, this.increaseEngineer )
        }
    }

    increasePilot = () => {
        let evt = new CustomEvent(`increaseCrew`, {detail: { crew: `pilot`}})
        document.dispatchEvent(evt)
    }

    increaseGunner = () => {
        let evt = new CustomEvent(`increaseCrew`, {detail: { crew: `gunner`}})
        document.dispatchEvent(evt)
    }

    increaseEngineer = () => {
        let evt = new CustomEvent(`increaseCrew`, {detail: { crew: `engineer`}})
        document.dispatchEvent(evt)
    }

    logMessage(message) {
        let evt = new CustomEvent(`message`, {detail: { message: message }})
        document.dispatchEvent(evt)
    }

    startGame = () => {
        console.log(`The game has begun!`)
    }

    addCardToBoard(card, facing) {
        const deckEl = document.querySelector(`.deck`)
        const cardEl = card.render(facing)
        deckEl.appendChild(cardEl)
    }

    saveGame() {
        localStorage.setItem(`dm21Save`, 
        JSON.stringify(
            {
                player: this.player,
                gameDeck: this.gameDeck,
            }
        ))
    }

    loadGame() {   
        try {
            const state = JSON.parse(localStorage.getItem(`dm21Save`))
            if (state && state.gameDeck){
                this.gameDeck = Deck().restore(state.gameDeck.cards)
                this.player = Player().restore(state.player.bonus, state.player.crewElements, state.player.components, state.player.repeat)

                return true
            }

           
        } catch (err) {
            console.error(`no game state`)
        }

        return false
    }
}