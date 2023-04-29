import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { use } from "react";
import { Address } from "@/models/Address";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";

export default async function handler(req, res){
    await mongooseConnect();
    const {user} = await getServerSession(req, res, authOptions);

    if(req.method === 'PUT'){
        if(user){

        const address = await Address.findOne({userAccountEmail: user.email});
        
        if(address){
            res.json(await Address.findByIdAndUpdate(address._id, req.body));
        } else {
            res.json(await Address.create({userAccountEmail: user.email, ...req.body}));
        }
    }
    }

    if(req.method === 'GET'){
        if(user){
        const address = await Address.findOne({userAccountEmail: user.email});
        if(address){
            res.json(address);
        } else {
            res.json(user.email);
        }
    }
    }
        
} 