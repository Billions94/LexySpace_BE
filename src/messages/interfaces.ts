export interface Message {
    text: string
    sender: string
    timestamp: Date
}

export type OnlineUser = {
    userName: string
    socketId: string
    room: string
}

