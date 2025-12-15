export let userprofile = async (uid) => {
    return JSON.parse(localStorage.getItem('profile'));
}

export let token = async (params) => {
    let token = document.cookie.split('_token=')[1];
    return token;
}

export let setCookie = async (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export let setTokan = async (tokan) => {
    const d  = new Date();
    d.setTime(d.getTime() + (30 /*30day*/ * 24 * 60 * 1000));
    let expires = 'expires='+d.toUTCString();
    document.cookie = `_lorem200=${tokan}; ${expires}; path=/`;
}

export let Htokan = () =>{
    return document.cookie.split('_lorem200=')[1];
}

export let checkcookie = async (params) => {
    let cookie = document.cookie.split('_user=')[1];
    return cookie;
}

export let roomcreaterid = async (params) => {
    let cookie = document.cookie.split('_user=')[1];
    return cookie;
}

export let deleteroom = async (delid) => {
    let response;
    await $.ajax({
        type:'delete',
        url:'https://quickify-fh37.onrender.com/api/delete-room?delid='+delid, //https://quickify-fh37.onrender.com
        header:{"Content-Type":"application/json"},
        beforeSend:function(req) {},
        success:function(res)
        {
            response = res;
        }
    });
    return response;
}

export let getTokanLocal = () => {
    return JSON.parse(localStorage.getItem('tokan'));
}

export let getallroom = async () =>{
    let response;
    await $.ajax({
        type:'get',
        url:'https://quickify-fh37.onrender.com/api/qshowAroom', //
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${getTokanLocal()}`},
        beforeSend:function(req){},
        success:function(res)
        {
            response = res;
        }
    });

    return response;
}

export let roomOC = async (roomid,type) => {
    let response;
    await $.ajax({
        type:'put',
        url:'https://quickify-fh37.onrender.com/api/updateroom?roomid='+roomid+"&type="+type,
        header:{"Content-Type":"application/json"},
        beforeSend:function(req){},
        success:function(res)
        {
            response = res;
        }
    });
    return response;
}

export let customcam = async () =>{
    return await navigator.mediaDevices.getUserMedia({video:true,audio:true});
}

export let socket = () =>{
    return io('https://quickify-fh37.onrender.com');
}

export let createConnection = async (localstream,limit) => {
    let config = {iceServers:[{urls:"stun:stun4.l.google.com:19302"}]};
}

export let changePass = async (userid,oldpassword,newpassword) => {
    let response;
    await $.ajax({
        type:'put',
        url:'https://quickify-fh37.onrender.com/api/change-password',
        header:{"Content-Type":"application/json"},
        data:{userid,oldpassword,newpassword},
        beforeSend:function(req){},
        success:function(res)
        {
            response = res;
        }
    });
    return response;
}

export let addCustomUser = async (type,sid,rid) => {
    let response;
    await $.ajax({
        type:'post',
        url:'https://quickify-fh37.onrender.com/api/add-custom-user',//https://quickify-fh37.onrender.com/api/add-custom-user
        header:{"Content-Type":"application/json"},
        data:{type,sid,rid},
        beforeSend:function(req){},
        success:function(res)
        {
            response = res;
        }
    });
    return response;
}

export let getCustomUser = async (sid) => {
    let response;
    await $.ajax({
        type:'post',
        url:'https://quickify-fh37.onrender.com/api/get-custom-user',
        header:{"Content-Type":"application/json"},
        data:{sid},
        beforeSend:function(req){},
        success:function(res)
        {
            response = res;
        }
    });
    return response;
}

export let deletecustomuser = async (id) => {
    let response;
    await $.ajax({
        type:'delete',
        url:'https://quickify-fh37.onrender.com/api/delete-custom-room?delid='+id,
        header:{"Content-Type":"application/json"},
        beforeSend:function(req){},
        success:function(res)
        {
            response = res;
        }
    });
    return response;
}

export let searchuser = async (username) => {
    let response;
    await $.ajax({
        type:'get',
        url:'https://quickify-fh37.onrender.com/api/search-user?username='+username,
        header:{"Content-Type":"application/json"},
        beforeSend:function(req){},
        success:function(res)
        {
            response = res;
        }
    });
    return response;
}

export let todayDate = ()=>{
    let date = new Date().getDay();
    switch(date)
    {
        case 0 : return 'Sunday';
        break;
        case 1 : return 'Monday';
        break;
        case 2 : return 'Tuesday';
        break;
        case 3 : return 'Wednesaday';
        break;
        case 4 : return 'Thursday';
        break;
        case 5 : return 'Friday';
        break;
        case 6 : return 'Saturday';
    }
}

export let deactivatedAccount = async (id,pass)=>{
    let response;
    await $.ajax({
        type:'delete',
        url :'https://quickify-fh37.onrender.com/api/de-activate-account?id='+id+'&pass='+pass,
        header:{"Content-Type":"application/json"},
        beforeSend:function(req){},
        success:function(res)
        {
            response = res;
        }
    });
    return response;
}

export let sendTokanAndReciveruser = async (tokan) =>{
    let response;
    await $.ajax({
        type:'post',
        url:'https://quickify-fh37.onrender.com/api/get-user',
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${tokan}`},
        success:function(res)
        {
            response = res;
        }
    });
    return response;
}

export let logout = () =>
{
    document.cookie = "_user" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('profile');
    localStorage.removeItem('tokan');
    window.location.href='index.html';
}