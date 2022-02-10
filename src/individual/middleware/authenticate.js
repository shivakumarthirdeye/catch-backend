require('dotenv').config()
import jwt from 'jsonwebtoken';


// This function verifies JWT token
 
 function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null){
        return res.json({status:'failed', msg:"Authentication token is missing."})
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.json({status:'failed', msg:"Invalid token."});
        }
        req.user = user
        next()
    })
};

module.exports = authenticateToken;