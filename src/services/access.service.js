'use strict';

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");



const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}


class AccessService {


    /* 
        check this token used?   
    */

    static handlerRefreshToken = async (refreshToken) =>{
        // xem token nay da duoc su dung hay chua
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        // neu co
        if(foundToken){
            // decode see who is this?
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({userId, email});

            // xoa tat ca token trong keyStore
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happened!! Please ReLogin')
        }
        // khong co
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if(!holderToken) throw new AuthFailureError('Shop not refistered 1');



        // verify Token
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey);
        console.log('[2] ---', {userId, email});
        // check userId
        const foundShop = await findByEmail({email});
        if(!foundShop) throw new AuthFailureError('Shop not refistered 2');

        // tao 1  cap token moi
        const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey)


        // update tokens
        const keyToken =  await  holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken // Cập nhật refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // Thêm refreshToken vào mảng refreshTokensUsed
            }
            
        })
   

        return {
            user: {userId, email},
            tokens
        }
    }


    static handlerRefreshTokenv2 = async ({refreshToken, user, keyStore}) =>{
        const {userId, email} = user;
        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happened!! Please ReLogin')
        }
        if(keyStore.refreshToken !== refreshToken){
            throw new AuthFailureError('Shop not refistered');
        }
        const foundShop = await findByEmail({email});
        if(!foundShop) throw new AuthFailureError('Shop not refistered 2');

        // tao 1  cap token moi
        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey);
        const holderShop = await KeyTokenService.findByRefreshToken(refreshToken);

        // update tokens
        const keyToken =  await  holderShop.updateOne({
            $set: {
                refreshToken: tokens.refreshToken // Cập nhật refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // Thêm refreshToken vào mảng refreshTokensUsed
            }
            
        })
   

        return {
            user,
            tokens
        }
       
    }

    static logout = async (keyStore) =>{
        
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        
        return {delKey};
    }


    /*
        1 - check email in dbs
        2 - match password
        3 - create AccessToken and refresh token and sava
        4 - genarate tokens
        5 - get data return login

    */
    static login = async ({email, password, refreshToken = null}) =>{
        

        // step 1: check email in dbs
        const foundShop = await findByEmail({email});
        if(!foundShop) throw new BadRequestError('Shop not registered');


        // step 2: match password
        const match = bcrypt.compare(password, foundShop.password);
        if(!match) throw new AuthFailureError('Authentication failed');


        // step 3: create token
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        // step 4:  genarate tokens
        const {_id: userId} = foundShop._id;
        const tokens = await createTokenPair({userId, email}, publicKey, privateKey);

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey: privateKey,
            publicKey: publicKey,
            userId

        })

        return {
            shop: getInfoData({fileds: ['_id', 'email', 'name'], object: foundShop}),
            tokens
        }
    }

    static signUp = async ({name, email, password}) =>{
        try{
            // step 1: check email exists?
            const holderShop = await shopModel.findOne({ email }).lean();

            if(holderShop){
                throw new BadRequestError('Error shop already register')
            }

            // handle password 
            const passwordHash = await bcrypt.hash(password, 10)
            

            // Create shop
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP]
            })

            if(newShop){
                // created private Key, public Key
                // const {privateKey, publicKey}  = crypto.generateKeyPairSync('rsa',{
                //     modulusLength: 4098,
                //     publicKeyEncoding: {
                //         type:'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type:'pkcs1',
                //         format: 'pem'
                //     }
                // });

                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                console.log({privateKey, publicKey}); // save collection keyStore


                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                });

                if(!keyStore){
                    return{
                        code: 'xxxx',
                        message: 'publicKeyString error!'
                    }
                };

                

                // created token pairpublicKey
                const tokens = await createTokenPair({userId:newShop._id, email}, publicKey, privateKey);

                console.log('Create token successful', tokens);

                return {
                    code: 201,
                    metaData: {
                        shop: getInfoData({fileds:['_id', 'name', 'email'],object: newShop}),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                metaData: null
            }
        
        }catch(e){
            return {
                code: 'xxx',
                message: e.message,
                status: 'error',
            }
        }
    }
}

module.exports =  AccessService;