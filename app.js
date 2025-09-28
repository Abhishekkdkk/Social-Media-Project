import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './src/db/index.js';
import cors from 'cors';
import dotenv from 'dotenv';
import userroutes from './src/routes/user.routes.js';
import videoroutes from './src/routes/video.routes.js';
import imageroutes from './src/routes/image.routes.js';
import textroutes from './src/routes/text.routes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use('/api/users', userroutes);
app.use('/api/videos', videoroutes);
app.use('/api/images', imageroutes);
app.use('/api/texts', textroutes);

app.listen(process.env.PORT);