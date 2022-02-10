export interface Message {
    text: string
    image: string
    media: string
    sender: string
    timestamp: Date
}

export interface OnlineUser  {
    _id?: string
    userName: string
    image: string
    socketId: string
    room: string
}

// type Room = 'string'

