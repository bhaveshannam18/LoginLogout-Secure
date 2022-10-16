const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//SIGNUP 
const signup = async (req,res,next)=>{
    let existingUser;
    const {name,email,password} = req.body;
    try {
        existingUser = await User.findOne({email:email});
    } catch (err) {
        console.log(err);
    }
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    }

    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({
        name,
        email,
        password:hashedPassword,
    }); 
    try {
        user.save();
    } catch (err) {
        console.log(err);
    }

    return res.status(201).json({message:user});
}

//LOGIN
const login = async (req,res,next)=>{
    let existingUser;
    const {email,password} = req.body;
    try {
        existingUser = await User.findOne({email:email});
    } catch (err) {
        console.log(err);
    }
    if(!existingUser){
        return res.status(400).json({message:"No user found"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Credentials"});
    }

    const token = jwt.sign({id:existingUser._id},process.env.JWT_SECRET_KEY,{expiresIn:"35s"});

    if(req.cookies[`${existingUser._id}`]){
        req.cookies[`${existingUser._id}`] = ""
    }
    //Creating the cookie and puttin token inside of cookie
    res.cookie(String(existingUser._id),token,{  //String(existingUser._id) is the name of the cookie
        path:"/",
        expires:new Date(Date.now()+1000 *30),
        httpOnly:true,  
        sameSite:"lax"
    })
    return res.status(201).json({message:"Login Successfull",user:existingUser,token});
}

const verifyToken = (req,res,next)=>{
    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1];
    if(!token){
        return res.status(400).json({message:"No Token Found"});
    }
    jwt.verify(String(token),process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
            return res.status(400).json({message:"Invalid Token"})
        }
        req.id = user.id;
        next();
    })
}

const getUser = async (req,res,next)=>{
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId,"-password");
    } catch (err) {
        return new Error(err);
    }
    if(!user){
        return res.status(400).json({message:"User Not Found"});
    }
    return res.status(200).json({user});
}

const refreshToken = (req,res,next)=>{
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if(!prevToken){
        return res.status(400).json({message:"Couldn't find the token"});
    }
    jwt.verify(String(prevToken),process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
            console.log(err);
            return res.status(403).json({message:"Authentication Failed"});
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";

        const token = jwt.sign({id:user.id},process.env.JWT_SECRET_KEY,{
            expiresIn:"35s"
        })

        res.cookie(String(user.id),token,{
            path:"/",
            expires:new Date(Date.now() + 1000 * 30),
            httpOnly:true,
            sameSite:"lax"
        })

        req.id = user.id;
        next();
    })
}

const logout = (req,res,next)=>{
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if(!prevToken){
        return res.status(400).json({message:"Couldn't find the token"});
    }
    jwt.verify(String(prevToken),process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
            console.log(err);
            return res.status(403).json({message:"Authentication Failed"});
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";

        res.status(200).json({message:"Logout Successfull"}); 
    })
}

exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
exports.logout = logout;
