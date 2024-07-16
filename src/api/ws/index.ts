import { reqServerPort } from '@/api/user/index'

export default class Ws {
  ws: WebSocket | null
  msgQueue: any[]
  clientId: string
  reConnectSum: number
  address: {
    publicAddress: string,
    privateAddress: string
  }
  constructor() {
    this.address = {
      publicAddress: '',
      privateAddress: ''
    }
    this.ws = null
    this.msgQueue = []
    this.clientId = ''
    this.reConnectSum = 0
  }

  async openWs(ip = '') {
    if (!this.address.privateAddress || !this.address.privateAddress) {
      await this.getServerPort()
    }
    this.ws = new WebSocket(ip ? this.address.privateAddress : this.address.publicAddress)
    this.ws.addEventListener('open', (e) => {
      console.log('ws连接成功！' + e.target)
    })

    this.ws.addEventListener('message', (e) => {
      // console.log('ws收到服务端消息:' + e.data)
      this.msgQueue.push(JSON.parse(e.data))
      if (e.data.action == 'meta') {
        this.clientId = e.data.params
      }
    })

    this.ws.addEventListener('close', (e) => {
      console.log('ws服务端关闭！' + JSON.stringify(e))
      this.clientId = ''
    })

    this.ws.addEventListener('error', async (e) => {
      console.log('ws出错！' + JSON.stringify(e))
      await this.openWs(this.address.privateAddress)

    })
  }

  async getServerPort() {
    let res: any = await reqServerPort()
    if (res.code == 200) {
      this.address = res.data
    }
  }

  closeWs() {
    this.ws && this.ws.close()
    console.log('ws关闭成功！')
  }

  sendWs(data: any) {
    this.ws && this.ws.send(this.clientId ? { ...data, ClientId: this.clientId } : data)
  }
}
