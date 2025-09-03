import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import analyticsRoute from './routes/analyticsRoute.js'
import {auth} from './middleware/auth.js'
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth',authRoutes);
app.use('/api/jobs',auth,jobRoutes)
app.use('/api/analytics',auth,analyticsRoute)


// Start server
app.listen(port, () => {
  console.log(`✅ Listening on port ${port}`);
});
