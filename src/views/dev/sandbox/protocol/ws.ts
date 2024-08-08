class Onebot {
    bot: WebSocket | null
    url: string
    constructor() {
        this.url = 'ws://127.0.0.1/onebot/v11/ws'
        this.bot = null
    }

    connect(uin:number) {
        this.bot = new WebSocket(this.url, [`X-Self-ID:${uin}`,`X-Client-Role:Universal`])
    }
}