import { createConnection, customcam, deleteroom, getallroom, getTokanLocal, roomcreaterid, roomOC } from "../functions/Quickify.js";

$(document).ready(async function() {
    let socket  = io(); //'https://quickify-fh37.onrender.com'
    let roomuserid;
    let localstream;
    let peers = {};
    let remoteStreams = {};
    let createrid = await roomcreaterid();
    $.ajax({
        type:'get',
        url:'https://quickify-fh37.onrender.com/api/quickshowroom?createrid='+createrid,
        beforeSend:function(req){},
        success:function(res)
        {
            res.rooms.forEach(room =>{
                if(room.roomstartorclose == 'close')
                {
                    let li = `<li class="list-group-item" id="delid${room.createrid}">
                            <img src="${room.roompic}" class="profilepicroom  img-fluid img-thumbnail">
                            <span class="ms-5">${room.roomname}</span>
                            <span class="ms-5">${room.roomlimit}</span><!-- user joined total -->
                            <button class="btn btn-success animate__animated animate__pulse animate__infinite ms-5 startbtnopenroom" type="button" roomid='${room._id}' createrid='${room.createrid}' roomlimit ='${room.roomlimit}' roomname='${room.roomname}' >start room</button>
                            <button class="btn btn-danger animate__animated animate__pulse animate__infinite ms-5 deleteroom" type="button" deleteid='${room.createrid}'>delete room</button>
                        </li>`;
                        $("#insertmyroom").append(li);
                }
                else
                {
                    let li = `<li class="list-group-item">
                            <img src="${room.roompic}" class="profilepicroom  img-fluid img-thumbnail">
                            <span class="ms-5">${room.roomname}</span>
                            <span class="ms-5">${room.roomlimit}</span><!-- user joined total -->
                            <button class="btn btn-danger animate__animated animate__pulse animate__infinite ms-5" type="button">close room</button>
                        </li>`;
                        $("#insertmyroom").append(li);
                }
            });

            $(".deleteroom").each(function(){
                $(this).click(async function(){
                    let deleteid = $(this).attr('deleteid');
                    let confirm  = window.confirm("Are You Sure delete room");
                    if(confirm == true)
                    {
                        await deleteroom(deleteid).then((res)=>{
                            if(res.status == true)
                            {
                                $('#delid'+deleteid).addClass('d-none');
                            }
                            else
                            {
                                alert(res.message);
                            }
                        });
                    }
                });
            });

            $('.startbtnopenroom').each(function(){
                $(this).click(function(){
                    let rmid = $(this).attr('roomid');
                    let rmcid = $(this).attr('createrid');
                    let rmlimit = $(this).attr('roomlimit');
                    let roomname = $(this).attr('roomname');
                    let type = 'open';
                    $("#myroom").addClass('d-none');
                    $("#roomnameisname").html(roomname);
                    $("#calling").removeClass('d-none');
                    customcam().then((stream)=>{
                        localstream = stream;
                        document.getElementById('svideo').srcObject = stream;
                        roomOC(rmid,type).then((res)=>{
                            if(res.status == true)
                            {
                                socket.emit('openroom',rmid);
                                $("#room-close").attr('roomid',rmid);
                                $('#room-close').removeClass('d-none');
                                $("#disconnected").addClass('d-none');
                            }
                        })
                    });
                });
            });
        }
    });
    
    getallroom().then(async(rooms)=>{
        if(rooms.status == true)
        {
            let li;
            let Createdid = await roomcreaterid();
            rooms.getroom.forEach(async(user)=>{
                if(user.createrid != Createdid)
                {
                    if(user.roomstartorclose == "close")
                    {
                        li = `<li class="list-group-item">
                                    <img src="${user.roompic}" class="profilepicroom  img-fluid img-thumbnail">
                                    <button class="btn btn-primary ms-1 joinroombtn disabled" type="${user.roomtype}" createrid="${user.createrid}" id='roombtnid${user._id}' roomname='${user.roomname}' ><i class="fa fa-video"></i></button>
                                    <span class="ms-2">${user.roomname}</span>
                                    <span class="ms-2">${user.roomlimit}</span><!-- user joined total -->
                                    <span class="text-danger ms-1" id='roomidfire${user._id}'><i class="fa fa-fire" aria-hidden="true"></i></span>
                                    
                                </li>`;
                        $("#insertuserroom").append(li);
                    }
                    else if(user.roomstartorclose == "open")
                    {
                        if(user.roomtype == "private"){
                             li = `<li class="list-group-item">
                                        <img src="${user.roompic}" class="profilepicroom  img-fluid img-thumbnail">
                                        <button class="btn btn-primary joinroombtn animate__animated animate__pulse animate__infinite ms-1" type="${user.roomtype}" createrid='${user.createrid}' roomname='${user.roomname}'><i class="fa fa-video"></i></button>
                                        <span class="ms-1">${user.roomname}</span>
                                        <span class="ms-1">${user.roomlimit}</span><!-- user joined total -->
                                        <span class="text-success ms-1" id='roomid${user._id}'><i class="fa fa-fire" aria-hidden="true"></i></span>
                                        
                                    </li>`;
                            $("#insertuserroom").append(li);
                        }
                        else
                        {
                            li = `<li class="list-group-item">
                                        <img src="${user.roompic}" class="profilepicroom  img-fluid img-thumbnail">
                                        <button class="btn btn-primary joinroombtn animate__animated animate__pulse animate__infinite ms-1" type="${user.roomtype}" createrid='${user.createrid}'><i class="fa fa-video"></i></button>
                                        <span class="ms-1">${user.roomname}</span>
                                        <span class="ms-1">${user.roomlimit}</span><!-- user joined total -->
                                        <span class="text-success ms-2" id='roomid${user._id}'><i class="fa fa-fire" aria-hidden="true"></i></span>
                                        
                                    </li>`;
                            $("#insertuserroom").append(li);
                        }
                    }
                }
            }); 
            $('.joinroombtn').each(function(){
                $(this).click(function(){
                    let type = $(this).attr('type');
                    let createrid = $(this).attr('createrid');
                    let roomname = $(this).attr('roomname');
                    $("#roomnameisname").html(roomname);
                    roomuserid = createrid;
                    if(type == 'private')
                    {
                        let confirm = window.prompt('Enter Your Password');
                        if(confirm == 1234)
                        {
                            startremotevideo().then(()=>{
                                setTimeout(() => {
                                 socket.emit('join-room',{type,createrroomid:createrid,joinid:Createdid});
                                }, 1000);
                                $(this).html('joined');
                                $(this).removeClass('btn btn-primary');
                                $(this).addClass('btn btn-success');
                            });
                            
                        }
                    }
                    else
                    {
                        startremotevideo().then((remote)=>{
                                setTimeout(() => {
                                socket.emit('join-room',{type,createrroomid:createrid,joinid:Createdid});
                            }, 1000);
                            $(this).html('joined');
                            $(this).removeClass('btn btn-primary');
                            $(this).addClass('btn btn-success');
                        });
                    }
                })
            });
        }
        else
        {
            console.log(rooms.message);
        }
    });

//listener
socket.on('openroom',(roomid)=>{
    $("#roomidfire"+roomid).removeClass('text-danger');
    $("#roomidfire"+roomid).addClass('text-success');
    $("#roombtnid"+roomid).addClass('animate__animated animate__pulse animate__infinite');
    $("#roombtnid"+roomid).removeClass('disabled');
});

socket.on('join-room',({type,createrroomid,joinid})=>{
    if (!peers[joinid])
    {
        setTimeout(() => {
            createPeer(joinid);
            createOffer(joinid); 
        }, 1000); 
    } 
    else
    {
        createOffer(joinid);
    }
});

async function startremotevideo(params) {
    let stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
    localstream = stream;
    $("#userprofile").addClass('d-none');
    $("#myroom").addClass('d-none');
    $("#createroom").addClass('d-none');
    $("#userprofile").addClass('d-none');
    $("#calling").removeClass('d-none');
    document.querySelector("#svideo").srcObject = localstream;
}

function createPeer(joinid)
{
    let config = {iceServers:[{urls:"stun:stun4.l.google.com:19302"}]};
    let pc = new RTCPeerConnection(config);
    peers[joinid] = pc;

    localstream.getTracks().forEach(track =>{
        pc.addTrack(track,localstream);
    });

    pc.ontrack = function(event)
    {
        if (!remoteStreams[joinid]) {
            remoteStreams[joinid] = new MediaStream();
            let video = document.createElement("video");
            video.setAttribute('class','img-fluid img-thumbnail rivideo');
            video.id = "video-" + joinid;
            video.autoplay = true;
            video.playsInline = true;
            video.srcObject = remoteStreams[joinid];
            document.querySelector(".rvideobox").append(video);
        }
        remoteStreams[joinid].addTrack(event.track);
    }

    pc.onicecandidate = function(event)
    {
        if (event.candidate) {
            socket.emit("candidate", {
                from:createrid,
                to: joinid,
                candidate: event.candidate
            });
        }
    }
}

async function createOffer(joinid) {
    let pc = peers[joinid];
    let offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('created-offer',{from:createrid,to:joinid,offer:pc.localDescription});
}

socket.on('offer',async({from,to,offer})=>{
    if(createrid == to)
    {
        $("#disconnected").attr('from',from);
        if (!peers[from])
        {
            createPeer(from);
        } 
        let pc = peers[from];
        await pc.setRemoteDescription(offer);
        let answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('created-answer',{from,to,answer:pc.localDescription});
    }
});

socket.on('answer',async({from,to,answer})=>{
    if(createrid == from)
    {
        let pc = peers[to];
        await pc.setRemoteDescription(answer);
    }
});

socket.on('candidate',async({from,to,candidate})=>{
    let pc  = peers[from];
    if(pc)
    {
        await pc.addIceCandidate(candidate);
    }
});

socket.on('user-exit',({roomuserid,joinid})=>{
    // if(createrid == roomuserid)
    // {
    //     if (peers[joinid]) peers[joinid].close();
    //     delete peers[joinid];

    //     if (remoteStreams[joinid]) {
    //         delete remoteStreams[joinid];
    //     }
    //     let vid = document.getElementById("video-" + joinid);
    //     if (vid) vid.remove();
    // }
    if (peers[joinid]) peers[joinid].close();
    delete peers[joinid];
    if (remoteStreams[joinid]) {
        delete remoteStreams[joinid];
    }
    let vid = document.getElementById("video-" + joinid);
    if (vid) vid.remove();
});

socket.on('joinerid-room-close',(joinerid)=>{
    joinerid.forEach(join =>{
        if(join == createrid)
        {
            history.go();
        }
    })
});

socket.on('withoutjoinerid-room-close',(roomid)=>{
    $("#roomidfire"+roomid).removeClass('text-success');
    $("#roomidfire"+roomid).addClass('text-danger');
    $("#roombtnid"+roomid).removeClass('animate__animated animate__pulse animate__infinite');
    $("#roombtnid"+roomid).addClass('disabled');
});

//calling btn mute vclose disconnet
$('.callingbtn').each(function(){
    $(this).click(function(){
        let type = $(this).attr('type');
        if(type == "mute" || type == "unmute")
        {
            if(type == 'mute')
            {
                $("#mute").html('<i class="fa fa-microphone"></i>');
                $("#mute").attr('type','unmute');
                localstream.getTracks()[0].enabled = false;
            }
            else
            {
                $("#mute").html('<i class="fa fa-microphone-slash"></i>');
                $("#mute").attr('type','mute');
                localstream.getTracks()[0].enabled = true;
            }
        }
        else if(type == 'on' || type == 'off')
        {
            if(type == "on")
            {
                $("#cameraoff").html('<i class="fa fa-video"></i>');
                $("#cameraoff").attr('type','off');
                localstream.getTracks()[1].enabled = false;
            }
            else
            {
                $("#cameraoff").html('<i class="fa fa-video-slash"></i>');
                $("#cameraoff").attr('type','on');
                localstream.getTracks()[1].enabled = true;
            }
        }
        else
        {
            // socket.emit('user-exit',{roomuserid,joinid:createrid});
            // if (peers[joinid]) peers[joinid].close();
            // delete peers[joinid];
            // setTimeout(() => {
            //     history.go();
            // }, 1000);
        }
    })
});

$("#disconnected").click(function(){
    let from = $(this).attr('from');
    if (peers[from])
    {
        peers[from].close();
        delete peers[from];
        setTimeout(() => {
            history.go();
            socket.emit('user-exit',{roomuserid,joinid:createrid});
        }, 1000);
    } 
});

//room close
$("#room-close").click(function(){
   let roomid =  $(this).attr('roomid');
   let type =  'close';
   socket.emit('withoutjoinerid-room-close',roomid);
   roomOC(roomid,type).then((res)=>{
    if(res.status == true){
        let key = Object.keys(peers);
        socket.emit('joinerid-room-close',key);
        history.go();
    }
   });
});

// ✔ Disconnect pe 3 cheez clean karo

// peer.close()

// delete peers[joinid]

// delete remoteStreams[joinid]

// ✔ Reconnect pe naya MediaStream + video element banao

});