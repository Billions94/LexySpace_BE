export interface Message {
    text: string
    sender: string
    timestamp: Date
}

export interface OnlineUser  {
    userName: string
    socketId: string
    room: Room
}

type Room = 'blue' | 'red'

