class Opponent {
    constructor() {

        this.bonus = {
            pilot: 0,
            gunner: 0,
            engineer: 0
        }

        this.components = []

        this.crewElements = {
            pilot: document.querySelector(`.crew__pilot-level_opponent`),
            gunner: document.querySelector(`.crew__gunner-level_opponent`),
            engineer: document.querySelector(`.crew__engineer-level_opponent`)
        }

        this.nameElement = document.querySelector(`.ship-display__name_opponent`)

        this.setupListeners()
    }

    setupListeners() {
        document.addEventListener(`setupOpponent`, this.setupOpponent)
    }

    setupOpponent = (evt) => {
        let { level } = evt.detail
        let { referenceDeck } = evt.detail
        if(level===1){
            this.components = [
                referenceDeck.cards[9],
                referenceDeck.cards[0]
            ]
            this.bonus.engineer = 1
            this.bonus.gunner = 1
            this.bonus.pilot = 1
            this.crewElements.pilot.textContent = this.bonus.pilot
            this.crewElements.gunner.textContent = this.bonus.gunner
            this.crewElements.engineer.textContent = this.bonus.engineer
            this.name = `Blob Figher`
            this.nameElement.textContent = this.name

        }
        this.renderInstalledComponents()
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
        this.components.forEach(component => {
            if(!component.counter){
                let componentCard = document.createElement(`li`)
                componentCard.classList.add(`components__item`)
                componentCard.style.background = `url("${component.image}")`
                componentCard.style.backgroundPosition = `center`
                componentCard.style.backgroundSize = `cover`
                document.querySelector(`.components_opponent`).appendChild(componentCard)
            }
            else{
                let consumableItem = document.createElement(`li`)
                consumableItem.classList.add(`consumables__item`)
                consumableItem.textContent = `${component.title}: ${component.counter}`
                document.querySelector(`.consumables_opponent`).appendChild(consumableItem)
            }
        });
    }
}