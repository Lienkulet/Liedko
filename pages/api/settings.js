import { mongooseConnect } from "@/lib/mongoose";
import { Settings } from "@/models/Settings";

export default async function handler(req, res) {
    await mongooseConnect();

    if(req.method === 'GET'){
        const {name} = req.query;

        res.json( await Settings.findOne({name}));
    }
}