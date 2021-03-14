class TitleScreen {
    
    constructor(){
        // this.checkState()
        this.setupListeners()
    }

    checkState(){
        if(localStorage.getItem('dm21GameState')){   
            const state = localStorage.getItem('dm21GameState')
            if(state === 'inProg'){
                this.continueGame()
            }
        }
    }

    setupListeners(){
        document.querySelector(`.title-screen__item_new`).addEventListener(`click`, this.startGame)
        document.querySelector(`.title-screen__item_instructions`).addEventListener(`click`, this.toggleInstructions)
        document.querySelector(`.title-screen__item_continue`).addEventListener(`click`, this.continueGame)
        document.querySelector(`.instructions__close`).addEventListener(`click`, this.toggleInstructions)
    }

    startGame = () => {
        document.querySelector(`.title-screen`).classList.add(`hidden`)
        document.querySelector(`.game-display`).classList.remove(`hidden`)
        localStorage.setItem('dm21GameState', `inProg`)
        this.game = new Game()
    }

    toggleInstructions() {
        document.querySelector(`.instructions`).classList.toggle(`hidden`)
    }

    continueGame() {
        document.querySelector(`.title-screen`).classList.add(`hidden`)
        document.querySelector(`.game-display`).classList.remove(`hidden`)
        this.game = new Game()
    }
}