'use strict';


const JWT = require('jsonwebtoken');
const  asyncHandler  = require('../helpers/asyncHandler');
const { AuthFailureError, AuthNotFound } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN: 'x-rtoken-id',
}
const createTokenPair = async (payload, publicKey, privateKey) =>{
    try{
        // accessToken
        const accessToken = await JWT.sign(payload, publicKey,{
           
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
           
            expiresIn: '7 days'
        });

        
        JWT.verify(accessToken, publicKey, (err, decode) =>{
            if(err){
                console.log(`error verify::`, err);
            }else{
                console.log(`decode verify::`, decode);
            }
        })
        return {
            accessToken,
            refreshToken
        }
    }catch(e){

    }

}
 /*
        1 - Check userId missing??
        2 - Get AT 
        3 - Verify Tokne
        4 - Check user in db
        5 - check keystore with this userID
        6 - OK => next()
    */
const authentication = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers[HEADER.CLIENT_ID];
        if (!userId) throw new AuthFailureError('Invalid Request User ID');

        const keyStore = await findByUserId(userId);
        if (!keyStore) throw new AuthNotFound('Not Found KeyStore');

        const accessToken = req.headers[HEADER.AUTHORIZATION];
        if (!accessToken) throw new AuthFailureError('Invalid Request');

        const publicKey = keyStore.publicKey;
        if (!publicKey) throw new AuthFailureError('Public key not provided');

        const decodeUser = JWT.verify(accessToken, publicKey);
        if (userId !== decodeUser.userId) throw AuthFailureError("Invalid User");

        req.keyStore = keyStore;
        return next();
    } catch (error) {
        next(error);
    }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers[HEADER.CLIENT_ID];
        if (!userId) throw new AuthFailureError('Invalid Request User id');

        const keyStore = await findByUserId(userId);
        if (!keyStore) throw new AuthNotFound('Not Found KeyStore');

        if(req.headers[HEADER.REFRESHTOKEN]){
            try{
                const refreshToken = req.headers[HEADER.REFRESHTOKEN];
                const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
                if(userId !== decodeUser.userId) throw new AuthFailureError("Invalid Userid");
                req.keyStore = keyStore;
                req.user= decodeUser;
                req.refreshToken = refreshToken;
                return next();
            }catch(err){
                throw err;
            }

        }
        const accessToken = req.headers[HEADER.AUTHORIZATION];
        if (!accessToken) throw new AuthFailureError('Invalid Request');

        const publicKey = keyStore.publicKey;
        if (!publicKey) throw new AuthFailureError('Public key not provided');

        const decodeUser = JWT.verify(accessToken, publicKey);
        if (userId !== decodeUser.userId) throw AuthFailureError("Invalid User");

        req.keyStore = keyStore;
        return next();
    } catch (error) {
        next(error);
    }
});
       
        
const verifyJWT = async (token , keySecret) =>{
    return await JWT.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
}