import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'


export async function loginUser(req, res){
    try{
        const {email, password} = req.body
        const userResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(400).json({
        data: [],
        message: "Invalid email or password",
        status: "300",
      });
    }
    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).json({data: [],message: "Invalid email or password",status: "300",})
    }

    const token = jwt.sign(
        {id: user.id, email: user.email,username: user.username,}, // payload
        process.env.JWT_SECRET,          // secret Key
        {expiresIn : '1h'}                // token expiry time
    );

    res.cookie('token',token,{
        httpOnly:true,
        secure : false,
        sameSite : 'lax',
        maxAge: 60 * 60 * 1000,
    })

    return res.status(201).json({
        data:[{
            id: user.id,
            email: user.email,
            username: user.username,
        }],
        message: "Login successful", 
    })

    }
    catch(err){
        return res.status(500).json({message:'Something went wrong '+ err})
    }
}

