import jwt from 'jsonwebtoken'

export const auth = (req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message:'Unauthorized access'})    
    }

    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode;
        next();
    }
    catch(err){
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}