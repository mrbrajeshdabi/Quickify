import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose  from 'mongoose';
import {createServer} from 'http';
import  cors from 'cors';
import {Server} from 'socket.io';
import { router } from './app/routes/main.router.js';
import { fileURLToPath } from "url";
import path from 'path';
import { qcustomUserAdd } from './app/model/custom.user.model.js';
import passport from 'passport';
import pkg from "passport-google-oauth20";
import helmet from 'helmet';
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
const { Strategy: GoogleStrategy } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);
const io = new Server(server,{

    cors:{
        origin:'https://quickify-fh37.onrender.com/',
        methods:['get','post'],
        credentials:true,
    }
});

io.on('connection',(socket)=>{
    // console.log(socket.handshake.auth.userid);
    socket.on('openroom',(createrid)=>{
        socket.broadcast.emit('openroom',createrid);
    });

    //join room
    socket.on('join-room',({type,createrroomid,joinid})=>{
        socket.broadcast.emit('join-room',{type,createrroomid,joinid});
    });

    //offer
    socket.on('created-offer',({from,to,offer})=>{
        socket.broadcast.emit('offer',{from,to,offer});
    })
    socket.on('created-answer',({from,to,answer})=>{
        socket.broadcast.emit('answer',{from,to,answer});
    });
    socket.on('candidate',({from,to,candidate})=>{
         socket.broadcast.emit('candidate',{from,to,candidate});
    });

    //exit room 
    socket.on('user-exit',({roomuserid,joinid})=>{
        console.log({roomuserid,joinid});
        socket.broadcast.emit('user-exit',{roomuserid,joinid});
    });

    socket.on('joinerid-room-close',(joinerid)=>{
        socket.broadcast.emit('joinerid-room-close',joinerid);
    });

    socket.on('withoutjoinerid-room-close',(roomid)=>{
        socket.broadcast.emit('withoutjoinerid-room-close',roomid);
    });

    socket.on('customuseradd',async(sid)=>{
        let getsid = await qcustomUserAdd.find({sid});
        if(getsid)
        {
            socket.emit('customuseradd',getsid);
        }
    });

    //custom user one to one call
    socket.on('custom-offer',({from,to,fromname,frompic,offer})=>{
        socket.broadcast.emit('r-custom-offer',{from,to,fromname,frompic,offer});
    });

    socket.on('custom-answer',({from,to,fromname,frompic,answer})=>{
        socket.broadcast.emit('custom-answer',{from,to,fromname,frompic,answer});
        socket.on('custom-candidate',(candidate)=>{
            socket.broadcast.emit('custom-candidate',candidate);
        });
    });

    socket.on('customcalldisconnect',({from,to})=>{
        socket.broadcast.emit('customcalldisconnect',{from,to});
    });

    socket.on("decline-without-answer-call",(from)=>{
        socket.broadcast.emit('decline-without-answer-call',from);
    });

    socket.on('busy',(from)=>{
        socket.broadcast.emit('busy',from);
    });
});
    

//handler
app.use(xss());
app.use(mongoSanitize());
app.use(helmet());
app.use(passport.initialize());
app.use(express.static('public'));
app.use('/usersprofilepic',express.static(__dirname + '/usersprofilepic'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api',router);
//mongoose and server
mongoose.connect(process.env.MONGODB).then(()=>{
    server.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Server On Port ${process.env.PORT} || And Database Connected Now`);
    });
})

