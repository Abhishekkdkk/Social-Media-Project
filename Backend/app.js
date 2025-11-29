import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './src/db/index.js';
import cors from 'cors';
import dotenv from 'dotenv';
import userroutes from './src/routes/user.routes.js';
import videoroutes from './src/routes/video.routes.js';
import postroutes from './src/routes/post.routes.js';


dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use('/api/users', userroutes);
app.use('/api/videos', videoroutes);
app.use('/api/posts', postroutes);

export default app;

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
