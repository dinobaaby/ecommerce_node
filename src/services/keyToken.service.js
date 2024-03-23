'use strict';

const mongoose = require("mongoose");
const keytokenModel = require("../models/keytoken.model");


class KeyTokenService{
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) =>{
        try{
            // level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null



            // level xx 
            const filter = {user: userId}, update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken
            }, options = {upsert: true, new: true}
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
            
        }catch(e){
            return e
        }
    }



    static findByUserId = async ( userId ) =>{
        const uuid = new mongoose.Types.ObjectId(userId);
        return await keytokenModel.findOne({user: uuid}).lean()

    }

    static removeKeyById  = async (id) =>{
        console.log("Key ID: ",id);
        return await keytokenModel.deleteOne(id)
    } 

    static findByRefreshTokenUsed = async (refreshToken) =>{
        return await keytokenModel.findOne({refreshTokensUsed : refreshToken});
    }


    static deleteKeyById = async (userId) =>{
        return await keytokenModel.findOneAndDelete({user:userId});
    }

    static findByRefreshToken = async (refreshToken) =>{
        return await keytokenModel.findOne({refreshToken});
    }
}


module.exports = KeyTokenService;