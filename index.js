import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; 
import cors from 'cors';
import * as url from 'url';
import path from 'path';

import userRoutes from './routes/user.js';
import apiRoutes from './routes/api.js';


dotenv.config({path: './config/.env'});

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('../', import.meta.url));


const PORT = process.env.PORT || 5000 ;
const dbUri = process.env.dbUrl;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/user', userRoutes);
app.use('/free-apis', apiRoutes);

app.use(express.static('../client/build'));

app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})
app.get(`*`, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})



try {
  mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log("connected with mongodb"))
  .catch(err => console.log(err.message) );
  
} catch (error) { console.log('mongoose connection error : '+error.message); }


try { app.listen(PORT,()=>console.log(`server runing at: http://localhost:5000`)); } 
catch (err) { console.log('server connection err : '+ err.message) }
