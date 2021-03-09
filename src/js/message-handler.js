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
        // evt is a custom event and will have a key "detail" that may have a key "message"
        // instead of:
        // const msg = evt.detail.message
        // we can use destructuring
        const { message } = evt.detail

        this.secondaryMessageEl.textContent = this.mainMessageEl.textContent
        this.mainMessageEl.textContent = message
    }
}