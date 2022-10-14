const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        console.log("==>"+token)
        const user = jwt.verify(token,'secret');
        console.log(JSON.stringify(user));
        User.findById(user.userId).then(user=>{
            req.user=user;
            next();
        })
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false,message:'Auth Failed'});
    }
}

// module.exports = {authenticate}