import jwt from "jsonwebtoken";
// import dotenv from 'dotenv';
// dotenv.config({path: './config/.env'});

const createJWT = (userId, email, name, duration) => {
   const payload = {
      userId,
      email,
      name,
      duration
   };
   return jwt.sign(payload, process.env.TOKEN_SECRET, {
     expiresIn: duration,
   });
};

export default createJWT;