import * as jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export interface AuthPayload {
    userId : number
}

export const auth = (header: string) : AuthPayload => {
    const token = header.split(' ')[1];
    if(!token){
        throw new Error('No token provided');
    }
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY as jwt.Secret) as AuthPayload

    return data 

}