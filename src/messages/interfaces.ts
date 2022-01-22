export interface Message {
    text: string
    sender: string
    timestamp: Date
}

export interface OnlineUser  {
    userName: string
    image: string
    socketId: string
    room: Room
}

type Room = 'blue'

