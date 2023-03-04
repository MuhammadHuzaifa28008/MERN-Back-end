import jwt from 'jsonwebtoken';


export const authentication = (req, res, next) => {
    
    const {token} = req.headers;

    if(!token){
        // console.log("auth.js \n no token")
        return res.status(200).json({success: false, message:'login please'})
    }
    else{
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
            // console.log("no match")
            return res.status(200).json({ success: false, message:'login please'});
        }
        if (decoded) {
            // console.log("decoded")
            next();
        }
    });
    }
}