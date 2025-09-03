import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const {Pool} = pkg;

const pool = new Pool({
    user : process.env.DB_USER,
    host : process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

pool.connect()
.then(client =>{
    console.log("✅ Connected to PostgreSQL")
    client.release()
})
.catch(error =>{
    console.error("DB Connection error ",error.stack);
})

export default pool;