class Player {
    constructor() {
        this.pilotBonus = 0
        this.gunnerBonus = 0
        this.engineerBonus = 0
        this.installedComponents = []
        this.storedComponents = []
        this.repeat = false

        this.pilotEl = document.querySelector(`.crew__pilot-level_human`)
        this.gunnerEl = document.querySelector(`.crew__gunner-level_human`)
        this.engineerEl = document.querySelector(`.crew__engineer-level_human`)

        this.pilotEl.textContent = this.pilotBonus
        this.gunnerEl.textContent = this.gunnerBonus
        this.engineerEl.textContent = this.engineerBonus

        this.setupListeners()
    }

    setupListeners() {
        document.addEventListener(`increaseCrew`, this.increaseCrew)
    }

    increaseCrew = (evt) => {
        const { crew } = evt.detail
        let value = parseInt(sessionStorage.getItem('dm21IncreaseLevel'))
        if(crew === `pilot`){
            if(sessionStorage.getItem(`dm21GamePhase`) === `crewSetup` && this.pilotBonus > 1){
                this.repeat = true
            }
            else{
                this.pilotBonus = this.pilotBonus + value
                this.pilotEl.textContent = this.pilotBonus
                this.repeat = false
            }
        }
        else if(crew === `gunner`){
            if(sessionStorage.getItem(`dm21GamePhase`) === `crewSetup` && this.gunnerBonus > 1){
                this.repeat = true
            }
            else{
                this.gunnerBonus = this.gunnerBonus + value
                this.gunnerEl.textContent = this.gunnerBonus
                this.repeat = false
            }
        }
        else if(crew === `engineer`){
            if(sessionStorage.getItem(`dm21GamePhase`) === `crewSetup` && this.engineerBonus > 1){
                this.repeat = true
            }
            else{
                this.engineerBonus = this.engineerBonus + value
                this.engineerEl.textContent = this.engineerBonus
                this.repeat = false
            }
        }
        if(value === 2) { 
            sessionStorage.setItem('dm21IncreaseLevel', `1`)
            let message = `${crew} increased`
            message = message.toUpperCase();
            this.logMessage(message)
            this.logMessage(`Select Crew: Click on a different crew member to give them a +1 bonus.`)
        }
        else if(value === 1 && !this.repeat){
            let message = `${crew} increased`
            message = message.toUpperCase();
            this.logMessage(message)
            this.removeCrewListeners()
        }
        
    }

    removeCrewListeners = () => {
        let evt = new CustomEvent(`removeCrewListeners`)
        document.dispatchEvent(evt)
    }

    logMessage(message) {
        let evt = new CustomEvent(`message`, {detail: { message: message }})
        document.dispatchEvent(evt)
    }

    create() {
        
    }

    shuffle() {

    }

    reset() {
        
    }

    reveal(numCards) {
                
    }
}