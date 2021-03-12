class Game {
     constructor(){
        this.referenceDeck = new Deck()
        this.gameDeck = new Deck()
        this.player = new Player()

        this.missileDialog = document.querySelector(`.missile-dialog`)
        this.missileNumbers = document.querySelectorAll(`.missile-dialog__number-button`)
        this.missileTypes = document.querySelectorAll(`.missile-dialog__missile-type`)
        this.specialActions = document.querySelectorAll(`.special-actions__button`)
        this.componentDisplay = document.querySelector(`.components_human`)
        this.oppComponentDisplay = document.querySelector(`.components_opponent`)
        this.completeTurn = document.querySelector(`.complete`)
        this.undoTurn = document.querySelector(`.undo`)

        this.activeMissileIndex = -1
        this.lightMissileIndex = 0
        this.heavyMissileIndex = 0
        this.turnActions = []
        this.restoreComponents = []

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
        document.addEventListener(`toggleOpponentComponents`, this.toggleOpponentComponentListeners)
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
        this.attackRun = false
        this.expose = false
        this.hack - false
        document.querySelector(`.player-mat_opponent`).classList.toggle(`hidden`)
        this.logMessage(`Combat begins!`)
        this.togglePlayerComponentListeners()
        this.updateSpecialActionListeners()
    }

    togglePlayerComponentListeners = () => {
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

    toggleOpponentComponentListeners = () => {
        this.oppComponents = this.oppComponentDisplay.querySelectorAll(`.components__item`)
        this.oppComponents.forEach(component => {
            component.classList.toggle(`clickable`)
            if(component.classList.contains(`clickable`)){
                component.addEventListener(`click`, this.handleOpponentComponentClick)
            }
            else{
                component.removeEventListener(`click`, this.handleOpponentComponentClick)
            }
        })
    }

    updateSpecialActionListeners = () => {
        if(this.attackRun){
            this.specialActions.forEach(action => {
                action.classList.remove(`clickable`)
                action.removeEventListener(`click`, this.handleSpecialActionClick)
            });
        }
        else if(this.expose){
            for(let i=0;i<this.specialActions.length;i++){
                if(i<2){
                    this.specialActions[i].classList.remove(`clickable`)
                    this.specialActions[i].removeEventListener(`click`, this.handleSpecialActionClick)
                }
            }
        }
        else if(this.hack){
            for(let i=0;i<this.specialActions.length;i++){
                if(i===0 || i===2){
                    this.specialActions[i].classList.remove(`clickable`)
                    this.specialActions[i].removeEventListener(`click`, this.handleSpecialActionClick)
                }
            }
        }
        else{
            this.specialActions.forEach(action => {
                if(!action.classList.contains(`clickable`)){
                    action.classList.add(`clickable`)
                    action.addEventListener(`click`, this.handleSpecialActionClick)
                }                
            })
        }
        
        

    }

    toggleTurnButtonListeners = () => {
        this.completeTurn.classList.toggle(`clickable`)
        if(this.completeTurn.classList.contains(`clickable`)){
            this.completeTurn.addEventListener(`click`, this.handleCompleteTurnClick)
        }
        else{
            this.completeTurn.removeEventListener(`click`, this.handleCompleteTurnClick)
        }
        this.undoTurn.classList.toggle(`clickable`)
        if(this.undoTurn.classList.contains(`clickable`)){
            this.undoTurn.addEventListener(`click`, this.handleUndoTurnClick)
        }
        else{
            this.undoTurn.removeEventListener(`click`, this.handleUndoTurnClick)
        }
    }

    findComponentIndex = (string) => {
        for(let i=0; i<this.player.components.installed.length;i++){
            if(this.player.components.installed[i].title === string){
                return i
            }
        }
        return -1
    }

    findTurnIndex = (string) => {
        for(let i=0; i<this.turnActions.length;i++){
            if(this.turnActions[i].log.indexOf(string) != -1){
                return i
            }
        }
        return -1
    }

    handleSpecialActionClick = (evt) => {
        if(evt.target.classList.contains(`special-actions__button_attack-run`)){
            this.attackRun = true
            this.updateSpecialActionListeners()
            this.logMessage(`Select Weapon`)
        }
        else if(evt.target.classList.contains(`special-actions__button_expose`)){
            this.expose = true
            this.updateSpecialActionListeners()
            this.completeAction()
        }
        else{
            this.hack = true
            this.updateSpecialActionListeners()
            this.completeAction()
        }
    }

    handleUndoTurnClick = () =>{
        if(this.attackRun) this.togglePlayerComponentListeners()
        this.turnActions = []
        this.expose = false
        this.hack = false
        this.attackRun = false
        this.countermeasures = false
        if(this.restoreComponents.length > 0){
            this.player.components.installed = this.restoreComponents
            if(this.activeMissileIndex != -1)
            this.player.components.installed[this.activeMissileIndex].counter = this.activeMissileQuantity
        }
        this.restoreComponents = []
        this.updateSpecialActionListeners()
        this.completeAction()
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
                this.lightMissileIndex = -1
                this.heavyMissileIndex = -1
                if(this.findComponentIndex(`Light Missiles`) != -1){
                    this.lightMissileIndex = this.findComponentIndex(`Light Missiles`)
                }
                else if(this.findComponentIndex(`Heavy Missiles`) != -1){
                    this.heavyMissileIndex = this.findComponentIndex(`Heavy Missiles`)
                }
                if(this.heavyMissileIndex > -1 || this.lightMissileIndex > -1){
                    this.missileDialog.classList.toggle(`hidden`)
                }
                if(this.heavyMissileIndex >-1 && this.lightMissileIndex > -1){
                    this.missileDialog.querySelector(`.missile-dialog__type`).classList.toggle(`hidden`)
                }
                else{
                    if(this.lightMissileIndex != -1){
                        this.activeMissileIndex = this.lightMissileIndex
                        this.selectMissileNumber()
                    } 
                    else if(this.heavyMissileIndex != -1){
                        this.activeMissileIndex = this.heavyMissileIndex
                        this.selectMissileNumber()
                    }
                    else{
                        this.logMessage(`No missiles left!`)
                    }
                }
            }
            else if(this.selectedComponent.title === `Auto Cannon`){
                if(this.findTurnIndex(`Auto Cannon`) === -1){
                    let action = {
                        log: `Fire Auto Cannon`,
                        type: `attack`,
                        missiles: 0,
                        value: 1
                    }
                    this.turnActions.push(action)
                    this.completeAction()
                }
                else{
                    this.logMessage(`${this.selectedComponent.title} already used.`)
                }
            }
            else if(this.selectedComponent.title === `Countermeasures`){
                if(!this.attackRun){
                    this.countermeasures = true;
                    this.backupComponents()
                    this.player.components.installed.splice(this.findComponentIndex(`Countermeasures`), 1)
                    this.completeAction()
                }
                else this.logMessage(`Must select weapon for attack run.`)
                
            }
        }
        evt.target.classList.toggle(`focus`)
        
    }

    selectMissileType = (evt) => {
        console.log(evt.target)
    }

    selectMissileNumber = () => {
        this.backupComponents()
        this.missileDialog.querySelector(`.missile-dialog__number`).classList.toggle(`hidden`)
        this.activeMissileQuantity = this.player.components.installed[this.activeMissileIndex].counter
        if(this.activeMissileIndex === this.lightMissileIndex){
            if (this.activeMissileQuantity > 4) this.maxMissiles = 4
            else this.maxMissiles = this.activeMissileQuantity
        }
        else{
            if (this.activeMissileQUantity > 2) this.maxMissiles = 2
            else this.maxMissiles = this.activeMissileQuantity
        }
        for(let i=0; i<this.maxMissiles; i++){
            this.missileNumbers[i].classList.remove(`hidden`)
        }
    }

    backupComponents = () => {
        if(this.restoreComponents.length === 0){
            this.player.components.installed.forEach(component => {
                this.restoreComponents.push(component)
            });
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
            this.player.components.installed.splice(this.activeMissileIndex, 1)
        }
        this.completeAction()
    }

    completeAction = () => {
        let logString = ``
        if(this.countermeasures){
            logString += `Deploy Countermeasures`
            if(this.turnActions.length > 0 || this.expose || this.hack) logString += ` & `
        }
        if(this.expose){
            logString += `Expose`
            if(this.turnActions.length > 0 || this.hack) logString += ` & `
        }
        if(this.hack){
            logString += `Hack`
            if(this.turnActions.length > 0) logString += ` & `
        }
        if(this.attackRun){
            logString += `Attack Run: `
            this.togglePlayerComponentListeners()
        }
        if(this.turnActions.length>0){
            for(let i=0;i<this.turnActions.length;i++){
                logString += this.turnActions[i].log
                if(this.turnActions.length > 1 && i != this.turnActions.length-1){
                    logString += ` & `
                }
            }
        }

        this.player.renderInstalledComponents()

        if(!this.completeTurn.classList.contains(`clickable`)){
            this.toggleTurnButtonListeners()
        }
        if (logString === ``){
            logString = `TURN RESET`
            this.toggleTurnButtonListeners()
        }
        this.logMessage(logString)
        if(this.attackRun){
            this.logMessage(`Press "Complete Turn"`)
        }
        
    }

    handleCompleteTurnClick = () => {
        let attack = 0;
        array.forEach(element => {
            
        });
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