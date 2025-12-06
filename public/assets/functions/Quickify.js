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

export let getallroom = async () =>{
    let response;
    await $.ajax({
        type:'get',
        url:'https://quickify-fh37.onrender.com/api/qshowAroom',
        header:{"Content-Type":"application/json"},
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

export let logout = () =>
{
    document.cookie = "_user" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('profile');
    history.go();
}