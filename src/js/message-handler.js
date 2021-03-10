class MessageHandler {
    constructor() {
        this.mainMessageEl = document.querySelector(`.message-bar__message_main`)
        this.secondaryMessageEl = document.querySelector(`.message-bar__message_secondary`)

        this.setupListener()
    }

    setupListener() {
        document.addEventListener(`message`, this.handleMessage)
    }

    handleMessage = (evt) => {
        const { message } = evt.detail

        this.secondaryMessageEl.textContent = this.mainMessageEl.textContent
        this.mainMessageEl.textContent = message
    }
}