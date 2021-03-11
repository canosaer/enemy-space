class Player {
    constructor() {

        this.bonus = {
            pilot: 0,
            gunner: 0,
            engineer: 0
        }

        this.components = {
            installed: [],
            stored: []
        }

        this.repeat = false

        this.crewElements = {
            pilot: document.querySelector(`.crew__pilot-level_human`),
            gunner: document.querySelector(`.crew__gunner-level_human`),
            engineer: document.querySelector(`.crew__engineer-level_human`)
        }

        this.crewElements.pilot.textContent = this.bonus.pilot
        this.crewElements.gunner.textContent = this.bonus.gunner
        this.crewElements.engineer.textContent = this.bonus.engineer

        this.setupListeners()
    }

    setupListeners() {
        document.addEventListener(`increaseCrew`, this.increaseCrew)
        document.addEventListener(`renderInstalledComponents`, this.renderInstalledComponents)
    }

    increaseCrew = (evt) => {
        const { crew } = evt.detail
        let value = parseInt(sessionStorage.getItem('dm21IncreaseLevel'))
        if(crew === `pilot`){
            if(sessionStorage.getItem(`dm21GamePhase`) === `crewSetup` && this.bonus.pilot > 1){
                this.repeat = true
            }
            else{
                this.bonus.pilot = this.bonus.pilot + value
                this.crewElements.pilot.textContent = this.bonus.pilot
                this.repeat = false
            }
        }
        else if(crew === `gunner`){
            if(sessionStorage.getItem(`dm21GamePhase`) === `crewSetup` && this.bonus.gunner > 1){
                this.repeat = true
            }
            else{
                this.bonus.gunner = this.bonus.gunner + value
                this.crewElements.gunner.textContent = this.bonus.gunner
                this.repeat = false
            }
        }
        else if(crew === `engineer`){
            if(sessionStorage.getItem(`dm21GamePhase`) === `crewSetup` && this.bonus.engineer > 1){
                this.repeat = true
            }
            else{
                this.bonus.engineer = this.bonus.engineer + value
                this.crewElements.engineer.textContent = this.bonus.engineer
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
            this.advancePhase()
        }
        
    }

    removeCrewListeners = () => {
        let evt = new CustomEvent(`removeCrewListeners`)
        document.dispatchEvent(evt)
    }

    advancePhase = () => {
        let evt = new CustomEvent(`advancePhase`)
        document.dispatchEvent(evt)
    }

    logMessage(message) {
        let evt = new CustomEvent(`message`, {detail: { message: message }})
        document.dispatchEvent(evt)
    }

    renderInstalledComponents = () => {
        let componentDisplay = document.querySelector(`.components_human`)
        let consumableDisplay = document.querySelector(`.consumables_human`)
        let oldRender = componentDisplay.querySelectorAll(`.components__item`)
        oldRender.forEach(element => {
            element.remove()
        });
        oldRender = consumableDisplay.querySelectorAll(`.consumables__item`)
        oldRender.forEach(element => {
            element.remove()
        });
        this.components.installed.forEach(component => {
            if(!component.counter){
                let componentCard = document.createElement(`li`)
                componentCard.classList.add(`components__item`)
                componentCard.style.background = `url("${component.image}")`
                componentCard.style.backgroundPosition = `center`
                componentCard.style.backgroundSize = `cover`
                componentDisplay.appendChild(componentCard)
            }
            else{
                let consumableItem = document.createElement(`li`)
                consumableItem.classList.add(`consumables__item`)
                consumableItem.textContent = `${component.title}: ${component.counter}`
                consumableDisplay.appendChild(consumableItem)
            }
        });
    }
}