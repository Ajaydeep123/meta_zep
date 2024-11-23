
import jwt, { JwtPayload } from 'jsonwebtoken';

interface TokenData {
    role?: "Admin" | "User";
     userId?: string;
}

type ExtendedJwtPayload = JwtPayload & TokenData;

export const createToken = (data: TokenData) => {

    const secret = process.env.JWT_SECRET
    console.log(secret)
    if (!secret) {
        throw new Error("JWT Secret missing!")
    }

    const token = jwt.sign(data, secret, { expiresIn: "1d" })
    return token;
};

export const verifyToken = (token: string) : ExtendedJwtPayload | null => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT Secret missing!");
        }

        const data = jwt.verify(token, secret) as ExtendedJwtPayload;
        return data;
    } catch (error) {
        console.error("error in verifyToken", error);
        return null;
    }    
}