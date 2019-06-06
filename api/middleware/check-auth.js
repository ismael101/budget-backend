const jwt = require('jsonwebtoken')
module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, "IU3BRF8OIBW8YDBC9UIWEDHC80429H" )
        req.userData = decode
        next()
    }catch(err){
        return res.status(401).json({
            message:'Authentication Failed',
            error:err
        })
    }
}