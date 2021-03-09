class Component{
    
    constructor(){
        this.title = ''
        this.size = 0
        this.cost = 0
        this.type = ''
        this.attack = 0
        this.counter = 0
        this.disabled = false
        this.image = ''
    }

    render(facing) {
        const cardEl = document.createElement(`div`)
        cardEl.classList.add(`card`)

        const suitEl = document.createElement(`span`)
        suitEl.classList.add(`suit`)
        suitEl.classList.add(this.suit)
        suitEl.innerHTML = this.suit

        const rankEl = document.createElement(`span`)
        rankEl.classList.add(`rank`)
        rankEl.innerHTML = this.rank

        cardEl.appendChild(rankEl)
        cardEl.appendChild(suitEl)
        if(facing === `down`){
            const cardBack = document.createElement(`div`)
            cardBack.classList.add(`card-back`)
            cardEl.appendChild(cardBack)
        }

        return cardEl
    }
}