import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export async function registerUser(req, res) {
    try{
        const { username, email, password } = req.body;
        const checkUserEmail = await pool.query("SELECT * FROM users WHERE email = $1",[email])
        const checkUsername = await pool.query("SELECT * FROM users WHERE username = $1",[username])
        if(checkUserEmail.rows.length > 0){
            return res.status(400).json({data:[], message : `Email Already Registered`, status: '400'})
        }
        if(checkUsername.rows.length > 0){
            return res.status(400).json({data:[], message : `Username Already Exists`, status: '400'})
        }
        
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password,saltRounds)

        const insertValues = await pool.query("INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id,username, email",
            [username, email, hashedPassword]
        )
        return res.status(201).json({success: true,message : "user registered Successfull",data : [insertValues.rows[0]]})
    }
    catch(err){
        return res.status(500).json({data:[], message:`something went wrong ${err}`})
    }
}