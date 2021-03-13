class Game {
     constructor(){
        this.referenceDeck = new Deck()
        this.gameDeck = new Deck()
        this.player = new Player()
        this.opponent = new Opponent()

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
        this.defense = 5

        this.opponentAttacked = false;
        this.playerAttacked = false;

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
            sessionStorage.setItem('dm21GamePhase', `started`)
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
        this.expose = false
        this.hack - false
        document.querySelector(`.player-mat_opponent`).classList.toggle(`hidden`)
        this.newRound()
    }

    newRound = () => {
        this.logMessage(`New combat round begins!`)
        this.attackRun = false
        this.countermeasures = false
        this.playerAttacked = false
        this.opponentAttacked = false
        this.turnActions = []
        this.restoreComponents = []
        this.updateSpecialActionListeners()
        this.player.renderInstalledComponents()
        this.rollInitiative()
    }

    rollInitiative = () => {
        let playerRoll = this.rollD6() + this.rollD6() + this.player.bonus.pilot
        let oppRoll = this.rollD6() + this.rollD6() + this.opponent.bonus.pilot
        if(playerRoll >= oppRoll){
            this.logMessage(`Player's turn`)
            if(!this.componentDisplay.querySelector(`.components__item`).classList.contains(`clickable`)) this.togglePlayerComponentListeners()
        }
        else{
            this.logMessage(`Opponent's turn`)
            this.opponentAttack()
        }
    }

    opponentAttack = () => {
        console.log(`start attack`)
        this.opponentAttacked = true;
        let attackValue = 0;
        // let nonDisabled = 0;
        let tempDefense = this.opponent.defense
        let hackPenalty = 0;
        let targetComponent = this.player.components.installed[0]
        if(this.hack){
            hackPenalty = this.player.bonus.engineer
            this.hack = false
        }
        if(this.expose){
            tempDefense = tempDefense - (0.1 * this.player.bonus.pilot)
        }
        if(this.level === 1){
            // if(this.hack) multiActionPenalty++
            if(this.opponent.components[1].counter > 1 ){
                for(let i=0;i<2;i++){
                    this.opponent.components[1].counter--
                    let playerEvadeRoll = this.rollD6() + this.rollD6() + this.player.bonus.pilot
                    if(playerEvadeRoll < 10){
                        attackValue += 5
                    }
                }
                this.opponent.renderInstalledComponents()
            }
            let adjustedAttack = attackValue - hackPenalty + this.opponent.bonus.gunner
            if(adjustedAttack > 0){
                if(this.resolveAttack(adjustedAttack) > this.player.defense){
                    this.logMessage(`Enemy Attack Hit!`)
                    this.player.components.forEach(component => {
                        if(component.cost > targetComponent.cost && !component.disabled) targetComponent = component
                    });
                    this.logMessage(`${targetComponent.title} disabled.`)
                    targetComponent.disabled = true
                    this.player.renderInstalledComponents()
                    if(!this.playerAttacked) this.togglePlayerComponentListeners()
                    else this.newRound()

                    // if(nonDisabled === 1){
                    //     this.logMessage(`Enemy Ship Destroyed!`)
                    //     this.proceedToDock()
                    // }
                    // else{
                    //     this.logMessage(`Select a component on the enemy ship to disable.`)
                    //     this.toggleOpponentComponentListeners()
                    // }

                    
                }
                else{
                    this.logMessage(`Enemy Attack Missed!`)
                    this.logMessage(`Player's turn`)
                    if(!this.playerAttacked){
                        if(!this.componentDisplay.querySelector(`.components__item`).classList.contains(`clickable`)) this.togglePlayerComponentListeners()
                    }
                    else this.newRound()
                }
            }
            else{
                this.logMessage(`Enemy Attack Missed!`)
                this.logMessage(`Player's turn`)
                if(!this.playerAttacked){
                    if(!this.componentDisplay.querySelector(`.components__item`).classList.contains(`clickable`)) this.togglePlayerComponentListeners()
                }
                else this.newRound()
            }
        }
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

    handleOpponentComponentClick = (evt) =>{
        let targetBackground = evt.target.style.background.toString()
        for(let i=0; i<this.opponent.components.length;i++){
            if(targetBackground.indexOf(this.opponent.components[i].image) != -1){
                this.opponent.components[i].disabled = true
            }
        }
        this.opponent.renderInstalledComponents()
        this.toggleOpponentComponentListeners()
        this.newRound()
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
            missiles: parseInt(evt.target.textContent),
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
        this.playerAttacked = true
        this.toggleTurnButtonListeners()
        let attackValue = 0;
        let multiActionPenalty = 0;
        let nonDisabled = 0;
        if(this.expose) multiActionPenalty++
        if(this.hack) multiActionPenalty++
        if(this.turnActions.length > 1){
            multiActionPenalty += (this.turnActions.length-1)
        }
        this.turnActions.forEach(action => {
            if(action.missiles > 0){
                for(let i=0;i<action.missiles;i++){
                    let oppEvadeRoll = this.rollD6() + this.rollD6() + this.opponent.bonus.pilot
                    if(oppEvadeRoll < 10){
                        attackValue += action.value
                    }
                }
            }
            else if(!action.missiles && action.value){
                attackValue += action.value
            }
        });
        if(this.attackRun) attackValue++
        let adjustedAttack = attackValue - multiActionPenalty + this.player.bonus.gunner
        if(adjustedAttack > 0){
            if(this.resolveAttack(adjustedAttack) > this.opponent.defense){
                this.logMessage(`Attack Hit!`)
                this.opponent.components.forEach(component => {
                    if(!component.counter && !component.disabled) nonDisabled++
                });
                if(nonDisabled === 1){
                    this.logMessage(`Enemy Ship Destroyed!`)
                    this.proceedToDock()
                }
                else{
                    this.logMessage(`Select a component on the enemy ship to disable.`)
                    this.toggleOpponentComponentListeners()
                }

                
            }
            else{
                this.logMessage(`Attack Missed!`)

                if(!this.opponentAttacked) this.opponentAttack()
                else this.newRound()
            }
        }
        else{
            this.logMessage(`Attack Missed!`)
            if(!this.opponentAttacked) this.opponentAttack()
            else this.newRound()
        }


    }
    

    proceedToDock = () => {
        document.querySelector(`.player-mat_opponent`).classList.toggle(`hidden`)
        document.querySelector(`.proceed-to-dock`).classList.toggle(`hidden`)
    }

    rollD6 = () => {
        return Math.floor(Math.random() * 6) + 1
    }

    resolveAttack = (dice) => {
        let dieResults = []
        for(let i = 0; i < dice; i++) {
            dieResults[i] = this.rollD6()
        }
        dieResults.sort()
        let attackResult = dieResults[dieResults.length-1]
        let firstResult = dieResults.indexOf(attackResult)
        if(firstResult<dieResults.length-1){
            let bonus = (dieResults.length-1) - firstResult
            attackResult = attackResult + (bonus * 0.2)
        }
        return attackResult
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