import { addCustomUser, customcam, deletecustomuser, getCustomUser, roomcreaterid, userprofile } from "../functions/Quickify.js";

$(document).ready(function(){
    let socket = io();
    let type;
    let localstream;
    let caller;
    let reciver;
    let waiting;
    let checkbusy = false;
    $("#type").click(function(){
       type =  $(this).val();
       let html =
        `
        <label> Enter Your ${type} </label>
        <input type='${type}' id='${type}' name='${type}' required autocomplete='off' />

       `;
       $("#insertinput").html(html);
       $("#adduserbtn").removeClass('disabled');
       $("#adduserbtn").addClass('animate__animated animate__pulse');
    });

    $(".choosesearch").submit( async function(e){
        e.preventDefault();
       let rid =  $(`#${type}`).val();
       let sid = await roomcreaterid();
       $("#adduserbtn").html('<i class="fa fa-circle-o-notch fa-spin text-dark" aria-hidden="true"></i>');
        addCustomUser(type,sid,rid).then((res)=>{
            $("#adduserbtn").html('Add User');
            if(res.status == true)
            {
                let html = 
                `
                <div class="toast show bg-dark animate__animated animate__pulse" id="toast">
                    <div class="toast-header bg-dark">
                    <span class="text-danger">Message</span>   
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body text-success text-center">
                        User Add Successfully <i class="fa fa-check-circle text-warning"></i>
                    </div>
                </div>
                `;
                $(".toastmessage").html(html);
                setTimeout(() => {
                    $(".toastmessage").html('');
                    $(".choosesearch")[0].reset();
                    $("#listusericon").addClass('text-success animate__infinite');
                    socket.emit('customuseradd',sid);
                }, 2000);
            }
            else
            {
                let html = 
                `
                <div class="toast show bg-dark animate__animated animate__pulse" id="toast">
                    <div class="toast-header bg-dark">
                    <span class="text-danger">Error Message</span>   
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body text-success text-center">
                        ${res.message} <i class="fa fa-times text-danger"></i>
                    </div>
                </div>
                `;
                $(".toastmessage").html(html);
                setTimeout(() => {
                    $(".toastmessage").html('');
                    $(".choosesearch")[0].reset();
                }, 2000);
            }
        });
        
    });


    //offline get custom user
    roomcreaterid().then((sid)=>{
        $("#listusericon").removeClass('fa fa-users')
        $("#listusericon").addClass('fa fa-circle-o-notch fa-spin');
        getCustomUser(sid).then((res)=>{
            $("#listusericon").removeClass(' fa fa-circle-o-notch fa-spin')
            $("#listusericon").addClass('fa fa-users');
            if(res.status == true)
            {
                if(res.data.length > 0)
                {
                    res.data.forEach(index => {
                        let html = 
                        `
                        <li class="list-group-item" id="dellist${index._id}">
                                <div class="d-flex">
                                    <img src="${index.rpic}" class="img-fluid img-thumbnail profilepicroom" id="profilepicroom">
                                    <span class="ms-5 mt-2">${index.rusername}</span>
                                    <span class="ms-3 mt-2">${index.rstatus}</span>
                                    <div class="btn-group ms-2 w-50">
                                    <button class="btn btn-primary callanddel" type="call" id="call${index.rid}" rid="${index.rid}"><i class="fa fa-video animate__animated animate__pulse animate__infinite"></i></button>
                                    <button class="btn btn-danger callanddel " type="delete" id="delete${index.rid}" deleteid="${index._id}"><i class="fa fa-trash animate__animated animate__pulse animate__infinite"></i></button>
                                    </div>
                                </div>
                            </li>
                        `;
                        $("#inserusercustom").append(html);
                    });


                    //get call and delete
                    $(".callanddel").each(function(){
                        $(this).click(function(){
                            if($(this).attr('type') == 'call')
                            {
                                let type = $(this).attr('type'); //jab call chle tab jo cookie ki id usko busy karni padegi
                                let rid = $(this).attr('rid');
                                OneTwoOneCall(rid);
                            }
                            else
                            {
                                let delid = $(this).attr('deleteid');
                                $(this).html('Please Wait..');
                                deletecustomuser(delid).then((res)=>{
                                    if(res.status == true)
                                    {
                                        $(`#dellist${delid}`).addClass('d-none');
                                        $(this).html('<i class="fa fa-trash animate__animated animate__pulse animate__infinite"></i>');
                                    }
                                    else
                                    {
                                        console.log(res);
                                    }
                                });
                            }
                        });
                    });
                }
                else
                {
                    let html = 
                        `
                        <li class="list-group-item">
                             <span class="text-warning"> No Users Added </span>   
                        </li>
                        `;
                        $("#inserusercustom").html(html);
                }
            }
            else
            {
                console.log(res);
            }
        });
    });

    //online get custom user
    socket.on('customuseradd',(array)=>{
        array.forEach(index => {
            let html = 
            `
            <li class="list-group-item" id="dellist${index._id}">
                    <div class="d-flex">
                        <img src="${index.rpic}" class="img-fluid img-thumbnail profilepicroom" id="profilepicroom">
                        <span class="ms-5 mt-2">${index.rusername}</span>
                        <span class="ms-3 mt-2">${index.rstatus}</span>
                        <div class="btn-group ms-2 w-50">
                        <button class="btn btn-primary callanddel" type="call" id="call${index.rid}" rid="${index.rid}"><i class="fa fa-video animate__animated animate__pulse animate__infinite"></i></button>
                        <button class="btn btn-danger callanddel " type="delete" id="delete${index.rid}" deleteid="${index._id}"><i class="fa fa-trash animate__animated animate__pulse animate__infinite"></i></button>
                        </div>
                    </div>
                </li>
            `;
            $("#inserusercustom").append(html);
        });

        //get call and delete
        $(".callanddel").each(function(){
            $(this).click(function(){
                if($(this).attr('type') == 'call')
                {
                    let type = $(this).attr('type'); //jab call chle tab jo cookie ki id usko busy karni padegi
                    let rid = $(this).attr('rid');
                    OneTwoOneCall(rid);
                }
                else
                {
                    let delid = $(this).attr('deleteid');
                    $(this).html('Please Wait..');
                    deletecustomuser(delid).then((res)=>{
                        if(res.status == true)
                        {
                            $(`#dellist${delid}`).addClass('d-none');
                            $(this).html('<i class="fa fa-trash animate__animated animate__pulse animate__infinite"></i>');
                        }
                        else
                        {
                            console.log(res);
                        }
                    });
                }
            });
        });
    });



let PC = (function(){

    let peerconnection;
    let createPeerConnetion = ()=>{
        let config = {iceServers:[{urls:"stun:stun4.l.google.com:19302"}]};
        peerconnection = new RTCPeerConnection(config);

        //gettracks
        localstream.getTracks().forEach(track => {
            peerconnection.addTrack(track,localstream);
        });

        //ontrack
        peerconnection.ontrack = function(event)
        {
            //create reciver video
            document.getElementById("customsvideo").srcObject=event.streams[0];
        }

        //onicecandidate
        peerconnection.onicecandidate = function(event)
        {
            if(event.candidate)
            {
                //socket send candidate to from
                socket.emit('custom-candidate',event.candidate);
            }
        }

        return peerconnection;
    }


    return {
        getInstance : ()=>{
            if(!peerconnection)
            {
                peerconnection = createPeerConnetion();
            }
            return peerconnection;
        }
    }
})();


 async function OneTwoOneCall(rid)
 {
    let id = await roomcreaterid();
    $("#cdisconnected").attr('to',rid);
    $("#cdisconnected").attr('from',id);
    customcam().then((localvideo)=>{
        document.getElementById("customsvideo").srcObject=localvideo;
        localstream = localvideo;
        setTimeout(() => {
            $("#listcustomuser").addClass('d-none');
            $("#customcalling").removeClass('d-none');
            createoffer(rid);
        }, 1000);
    });
 } 
 
 async function createoffer(rid) {
    userprofile().then(async (user)=>{
        caller = new Audio('assets/call/caller.mp3');
        caller.loop = true;
        caller.play();
        let pc = await PC.getInstance();
        let sid = user._id;
        let sname = user.username;
        let spic = user.profilepic;
        let offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('custom-offer',{from:sid,to:rid,fromname:sname,frompic:spic,offer:pc.localDescription});
    });
 }

 async function createAnswers(from,to,fromname,frompic,offer) {
    let pc = await PC.getInstance();
    await pc.setRemoteDescription(offer);
    let answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('custom-answer',{from,to,frompic,fromname,answer:pc.localDescription});
 }

 async function setAnswer(answer) {
    checkbusy = true;
    let pc = await PC.getInstance();
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    document.getElementById("customrvideo").srcObject=localstream;
 }

 function declineCall(from) {
    socket.emit('decline-without-answer-call',from);
    history.go();
 }

 async function busyuser(from)
 {
    let id = await roomcreaterid();
    if(from == id)
    {
        caller.pause();
        waiting.loop = true;
        waiting = new Audio('assets/call/wating.mp3');
        waiting.play();
        let html ='<span id="errorcall" class="text-danger">User Is Busy</span>';
        $("#cdisconnected").click(function(){
            history.go();
        });
        $("#insertmsg").html(html);
            setTimeout(() => {
                $("#insertmsg").html('');
                history.go();
            }, 30000);
    }
 }

 //listener 
 socket.on('r-custom-offer',async ({from,to,fromname,frompic,offer})=>{
    let rid = await roomcreaterid();
    if(checkbusy == true)
    {
        socket.emit('busy' ,from);
    } 
    else
    {
        if(to == rid)
        {
            reciver = new Audio('assets/call/reciver.mp3');
            reciver.loop = true;
            reciver.play();
            $("#cmute").attr('to',to);
            $("#cdisconnected").attr('to',to);
            $("#ccameraoff").attr('to',to);
            $("#cmute").attr('from',from);
            $("#cdisconnected").attr('from',from);
            $("#ccameraoff").attr('from',from);
            let html =
            `<div class="toast show bg-dark animate__animated animate__bounceInDown" id="callingtoast">
                <div class="toast-header bg-dark">
                </div>
                <div class="toast-body text-success text-center">
                    <div class="d-flex">
                        <img src="${frompic}" class="img-fluid img-thumbnail profilepicroom">
                        <span class="text-warning ms-5 mt-2">calling from ${fromname}</span>
                    </div><br>
                    <div class="btn-group w-100">
                        <button class="btn btn-success animate__animated animate__pulse animate__infinite asnweranddecline" type="answer">Answer</button>
                        <button class="btn btn-danger  animate__animated animate__pulse animate__infinite asnweranddecline" type="decline">Decline</button>
                    </div>
                </div>
            </div>`;
            $(".callingmsg").html(html);

            //asnweranddecline
            $(".asnweranddecline").click(function(){
                if($(this).attr("type") == "decline") declineCall(from);
                $("#listcustomuser").addClass('d-none');
                $("#createroom").addClass("d-none");
                $("#myroom").addClass("d-none");
                $("#userprofile").addClass("d-none");
                $("#addcustomuser").addClass("d-none");
                $("#calling").addClass('d-none');
                $(".callingmsg").html('');
                let html ='<span id="errorcall" class="text-success">Call Connected</span>';
                $("#insertmsg").html(html);
                reciver.pause();
                reciver.currentTime = 0;
                customcam().then((localvideo)=>{
                    document.getElementById("customrvideo").srcObject = localvideo;
                    localstream = localvideo;
                    setTimeout(() => {
                        $("#searchresult").addClass('d-none');
                         $("#searchuserfrm").addClass('d-none');
                         $('#setting').addClass('d-none');
                         $('#userprofile').addClass('d-none');
                         $('#myroom').addClass('d-none');
                         $("#calling").addClass('d-none');
                         $("#addcustomuser").addClass('d-none');
                         $("#createroom").addClass('d-none');
                        //  $('#joinusers').addClass('d-none');
                         $("#listcustomuser").addClass('d-none');
                         $("#customcalling").removeClass('d-none');
                        createAnswers(from,to,fromname,frompic,offer);
                        checkbusy = true;
                },  1000);
                });
            });
        }
    }
    
 });

 socket.on('custom-answer',async({from,to,fromname,frompic,answer})=>{
    let sid = await roomcreaterid();
    if(from == sid)
    {
        $("#cmute").attr('to',to);
        $("#cdisconnected").attr('to',to);
        $("#ccameraoff").attr('to',to);
        $("#cmute").attr('from',from);
        $("#cdisconnected").attr('from',from);
        $("#ccameraoff").attr('from',from);
        let html ='<span id="errorcall" class="text-success">Call Connected</span>';
        $("#insertmsg").html(html);
        caller.pause();
        caller.currentTime = 0;
        setAnswer(answer);
    }
 });

 socket.on('custom-candidate',async(candidate)=>{
    let pc = await PC.getInstance();
    pc.addIceCandidate(new RTCIceCandidate(candidate));
 });

 socket.on("customcalldisconnect",async ({from,to})=>{
    let id = await roomcreaterid();
    if(from == id)
    {
        let pc = await PC.getInstance();
        if(pc)
        {
            pc.close();
            setTimeout(() => {
                history.go();
            }, 1000);
        }
    }
    else if(to == id)
    {
        setTimeout(() => {
            history.go();
        }, 1000);
        let pc = await PC.getInstance();
        if(pc)
        {
            pc.close();
            setTimeout(() => {
                history.go();
            }, 1000);
        }
    }
 });

 socket.on('decline-without-answer-call',async (from)=>{
    let id = await roomcreaterid();
    if(from == id) history.go();
 });

 socket.on('busy',(from)=>{
    busyuser(from);
 });

 //mute disconnetced and video close event
 $("#cmute").click(function(){
    let type = $(this).attr('type');
    if(type == 'mute')
    {
        // $("#cmute").html('<i class="fa fa-microphone"></i>');
        $("#cmute").removeClass('fa fa-microphone-slash');
        $("#cmute").addClass('fa fa-microphone');
        $("#cmute").attr('type','unmute');
        localstream.getTracks()[0].enabled = false;
    }
    else
    {
        // $("#cmute").html('<i class="fa fa-microphone-slash"></i>');
        $("#cmute").removeClass('fa fa-microphone');
        $("#cmute").addClass('fa fa-microphone-slash');
        $("#cmute").attr('type','mute');
        localstream.getTracks()[0].enabled = true;
    }
 });

 $("#ccameraoff").click(function(){
    let type = $(this).attr('type');
    if(type == "on")
    {
        // $("#ccameraoff").html('<i class="fa fa-video"></i>');
        $("#ccameraoff").removeClass('fa fa-video-slash');
        $("#ccameraoff").addClass('fa fa-video');
        $("#ccameraoff").attr('type','off');
        localstream.getTracks()[1].enabled = false;
    }
    else
    {
        // $("#ccameraoff").html('<i class="fa fa-video-slash"></i>');
        $("#ccameraoff").removeClass('fa fa-video');
        $("#ccameraoff").addClass('fa fa-video-slash');
        $("#ccameraoff").attr('type','on');
        localstream.getTracks()[1].enabled = true;
    }
 });

 $("#cdisconnected").click( async function(){
    let from = $(this).attr('from');
    let to = $(this).attr('to');
    let pc = await PC.getInstance();
    if(pc)
    {
        pc.close();
        socket.emit('customcalldisconnect',{from,to});
        setTimeout(()=>{history.go();},1000);
    }
 });

 $("#fsscreen").click(function(){
    let checktype = $(this).attr('type');
    let videoElem = document.getElementById("customsvideo");
    if(checktype == "off")
    {
        videoElem.requestFullscreen();
        // $(this).attr('type','on');
    }
    // if(checktype == 'on')
    // {
    //     videoElem.exitFullscreen();
    //     $(this).attr('type','on');
    // }
 })

});