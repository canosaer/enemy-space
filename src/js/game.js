class Game {
     constructor(){
        this.referenceDeck = new Deck()
        this.gameDeck = new Deck()
        this.player = new Player()
        this.missileDialog = document.querySelector(`.missile-dialog`)
        this.missileNumbers = document.querySelectorAll(`.missile-dialog__number-button`)
        this.missileTypes = document.querySelectorAll(`.missile-dialog__missile-type`)
        this.lightMissileIndex = 0
        this.heavyMissileIndex = 0
        this.turnActions = []

        this.setupListeners()
        new MessageHandler()

        this.setupShip()
        this.setupOpponent()
        this.setupCrew()
    }

    setupListeners(){
        document.querySelector(`.game-display__title`).addEventListener(`click`, this.returnToTitle)
        document.querySelector(`.game-display__subtitle`).addEventListener(`click`, this.returnToTitle)
        document.addEventListener(`removeCrewListeners`, this.toggleCrewListeners)
        document.addEventListener(`advancePhase`, this.advancePhase)
        document.addEventListener(`togglePlayerComponents`, this.togglePlayerComponentListeners)
        this.missileNumbers.forEach(button => {
            button.addEventListener(`click`, this.queueMissiles)
        });
        this.missileTypes.forEach(button => {
            button.addEventListener(`click`, this.selectMissileType)
        });
    }

    returnToTitle() {
        localStorage.setItem('dm21GameState', `paused`)
        document.querySelector(`.title-screen`).classList.remove(`hidden`)
        document.querySelector(`.game-display`).classList.add(`hidden`)
    }

    setupShip = () => {
        this.level = 1
        this.player.components.installed = [
            this.referenceDeck.cards[5],
            this.referenceDeck.cards[6],
            this.referenceDeck.cards[9],
            this.referenceDeck.cards[1]
        ]
        let evt = new CustomEvent(`renderInstalledComponents`)
        document.dispatchEvent(evt)
    }

    setupOpponent = () => {
        this.opponent = new Opponent()
        let evt = new CustomEvent(`setupOpponent`, {detail: { level: this.level, referenceDeck: this.referenceDeck }})
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
            sessionStorage.setItem('dm21GamePhase', `combat`)
            this.startLevel()
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

    startLevel = () => {
        document.querySelector(`.player-mat_opponent`).classList.toggle(`hidden`)
        this.logMessage(`Combat begins!`)
        this.togglePlayerComponentListeners()
        this.toggleSpecialActionListeners()
    }

    togglePlayerComponentListeners = () => {
        this.componentDisplay = document.querySelector(`.components_human`)
        this.components = this.componentDisplay.querySelectorAll(`.components__item`)
        this.components.forEach(component => {
            component.classList.toggle(`clickable`)
            if(component.classList.contains(`clickable`)){
                component.addEventListener(`click`, this.handlePlayerComponentClick)
            }
            else{
                component.removeEventListener(`click`, this.handlePlayerComponentClick)
            }
        })
    }

    toggleSpecialActionListeners = () => {
        this.specialActions = document.querySelectorAll(`.special-actions__button`)
        this.specialActions.forEach(action => {
            action.classList.toggle(`clickable`)
            if(action.classList.contains(`clickable`)){
                action.addEventListener(`click`, this.handleSpecialActionClick)
            }
            else{
                action.removeEventListener(`click`, this.handleSpecialActionClick)
            }
            
        })
    }

    findComponentIndex = (string) => {
        for(let i=0; i<this.player.components.installed.length;i++){
            if(this.player.components.installed[i].title === string){
                return i
            }
        }
        return -1
    }

    handleSpecialActionClick = (evt) => {
        if(evt.target.classList.contains(`special-actions__button_attack-run`)){
            this.logMessage(`Select Weapon`)
        }
    }

    handlePlayerComponentClick = (evt) => {
        evt.target.classList.toggle(`focus`)
        let targetBackground = evt.target.style.background.toString()
        if(evt.target.classList.contains(`focus`)){
            for(let i=0; i<this.player.components.installed.length;i++){
                if(targetBackground.indexOf(this.player.components.installed[i].image) != -1){
                    this.selectedComponent = this.player.components.installed[i]
                }
            }
            if(this.selectedComponent.title === `Missile Launcher`){
                if(this.findComponentIndex(`Light Missiles`) != -1){
                    this.lightMissileIndex = this.findComponentIndex(`Light Missiles`)
                }
                else if(this.findComponentIndex(`Heavy Missiles`) != -1){
                    this.lightMissileIndex = this.findComponentIndex(`Heavy Missiles`)
                }
                // for(let i=0; i<this.player.components.installed.length;i++){
                //     if(this.player.components.installed[i].title === `Light Missiles`){
                //         this.lightMissileIndex = i
                //     }
                //     else if(this.player.components.installed[i].title === `Heavy Missiles`){
                //         this.heavyMissileIndex = i
                //     }
                // }
                this.missileDialog.classList.toggle(`hidden`)
                if(this.heavyMissileIndex && this.lightMissileIndex){
                    this.missileDialog.querySelector(`.missile-dialog__type`).classList.toggle(`hidden`)
                }
                else{
                    if(this.lightMissileIndex){
                        this.activeMissileIndex = this.lightMissileIndex
                    } 
                    else{
                        this.activeMissileIndex = this.heavyMissileIndex
                    }
                    this.selectMissileNumber()
                }
            }
        }
        
    }

    selectMissileType = (evt) => {
        console.log(evt.target)
    }

    selectMissileNumber = () => {
        this.missileDialog.querySelector(`.missile-dialog__number`).classList.toggle(`hidden`)
        let activeMissileQuantity = this.player.components.installed[this.activeMissileIndex].counter
        if(this.activeMissileIndex === this.lightMissileIndex){
            if (activeMissileQuantity > 4) this.maxMissiles = 4
            else this.maxMissiles = activeMissileQuantity
        }
        else{
            if (activeMissileQUantity > 2) this.maxMissiles = 2
            else this.maxMissiles = activeMissileQuantity
        }
        for(let i=0; i<this.maxMissiles; i++){
            this.missileNumbers[i].classList.toggle(`hidden`)
        }
    }

    queueMissiles = (evt) => {
        this.missileDialog.querySelector(`.missile-dialog__number`).classList.toggle(`hidden`)
        this.missileDialog.classList.toggle(`hidden`)
        let action = {
            log: `Fire ${evt.target.textContent} ${this.player.components.installed[this.activeMissileIndex].title}`,
            type: `attack`,
            missiles: evt.target.textContent,
            value: this.player.components.installed[this.activeMissileIndex].attack
        }
        this.turnActions.push(action)
        this.player.components.installed[this.activeMissileIndex].counter = this.player.components.installed[this.activeMissileIndex].counter - evt.target.textContent
        if(this.player.components.installed[this.activeMissileIndex].counter === 0){
            this.player.components.installed.splice(this.activeMissileIndex)
            this.player.components.installed.splice(this.findComponentIndex(`Missile Launcher`))
        }
        this.completeAction()
    }

    completeAction = () => {
        let logString = ``
        for(let i=0;i<this.turnActions.length;i++){
            logString += this.turnActions[i].log
            if(this.turnActions.length > 1 && i != this.turnActions.length){
                logString += `, `
            }
        }
        this.logMessage(logString)
        this.player.renderInstalledComponents()
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