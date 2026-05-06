import users from "../models/users.js";

export const login=async(req,res)=>{
    try{

        const {clerk_id}=req.body;
        const user=await users.findOne({clerk_id})
        if(!user){
            return res.json({message:"user not found"})
        }

        return res.json({
            role : user.role,
            id : user?._id,
            name : user?.name
        })



    }
    catch(err){
        return res.json({message:err.message})

    }

}


export const register=async(req,res)=>{
    try{

        const {clerk_id,role,name}=req.body;
        const user=await users.findOne({email})
        if(user){
            return res.json({message:"user already found"})
        }

       const newUser= await users.create({
            clerk_id,
            role,
            name


        })
        return res.json({
            role : newUser.role,
            id : newUser?._id,
            name : newUser?.name
        })



    }
    catch(err){
        return res.json({message:err.message})

    

    }

}