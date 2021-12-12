import { Request, Response, NextFunction } from 'express'

export const badRequest = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(err.status === 400){
        res.status(400).send({message: err.errorList})
    } else {
        next(err)
    } 
}

export const unAuthorized = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(err.status === 401){
        res.status(401).send({message: 'Unathorized'})
    } else {
        next(err)
    }
}

export const notFound = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(err.status === 404){
        res.status(404).send({message: err.errorList || 'Data not found!', success: false})
        console.log(err)
    } else {
        next(err)
    }
}

export const genericError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(err.status === 500){
        res.status(500).send({message: 'server error'})
    } else {
        next(err)
    }
}