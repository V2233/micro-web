interface resCodeType {
    code: number
    message: string
}

interface userBaseConfigType {
    type: string
    desc: string
    value: any
}

export interface userConfigType {
    avatar: userBaseConfigType
    username: userBaseConfigType
    password: userBaseConfigType
    desc: userBaseConfigType
    routes: userBaseConfigType
}


export interface userConfigResponseType extends resCodeType {
    data: userConfigType[]
}
