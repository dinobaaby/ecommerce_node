'use strict';

const { findById } = require("../services/apiKey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}
const apiKey = async (req,res, next) =>{
    try{
        const key = req.headers[HEADER.API_KEY]?.toString();
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        // check objKey
        const objKey = await findById(key);
        if(!objKey){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        req.objKey = objKey;
        return next();
    }catch(e){

    }
}

const permission =  (permission) =>{
    return (req, res, next) =>{
        if(!req.objKey.permisstions){
            return res.status(403).json({
                message: 'Permisstion Denied'
            })
        }

        console.log(req.objKey.permisstions);

        const validPermisstion = req.objKey.permisstions.includes(permission);
        console.log(validPermisstion);
        if(!validPermisstion){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        return next();

    }
}



module.exports = {
    apiKey,
    permission,
    
}