'use strict';

const AccessService = require("../services/access.service");
const {Ok, Create, SuccessResponse} = require('../core/success.response')
class AccessController{
    
    signUp = async (req, res, next) => {
       
        new Create({
            message: 'Register OK',
            metaData: await AccessService.signUp(req.body),
            options:{
                limit: 10
            }
        }).send(res)
         
       
    }

    login = async (req, res, next) => {
       
        new Create({
            message: 'Login OK',
            data: await AccessService.login(req.body),
           
        }).send(res)
    }

    logout = async (req, res, next) => {
       
        return res.status(200).json({
            message: 'Logout OK',
            data: await AccessService.logout( req.keyStore )
        })
    }

    handlerRefreshToken = async (req, res, next) => {
        // v1
        // return res.status(200).json({
        //     message: 'Get token Success',
        //     data: await AccessService.handlerRefreshToken( req.body.refreshToken )
        // })

        // v2
        return res.status(200).json({
            message: 'Get token Success',
            data: await AccessService.handlerRefreshTokenv2( {
                refreshToken: req.refreshToken,
                user: req.user,
               
                keyStore: req.keyStore
            } )
        })

    }
}


module.exports = new AccessController();