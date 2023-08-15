import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { JWT_SECRETKEY, TOKEN_EXPIRATION_TIME } = process.env;

interface DecodedToken {
  _id: string;
}

export const createToken = (id: string): string => {
  return jwt.sign(
    {
      _id: id,
    },
    JWT_SECRETKEY!,
    {
      expiresIn: TOKEN_EXPIRATION_TIME!,
    }
  );
};

export const verifyToken = (token: string): DecodedToken => {
  return jwt.verify(token, JWT_SECRETKEY!) as DecodedToken;
};