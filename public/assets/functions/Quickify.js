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
        url:'http://localhost:3000/api/delete-room?delid='+delid,
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
        url:'http://localhost:3000/api/qshowAroom',
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
        url:'http://localhost:3000/api/updateroom?roomid='+roomid+"&type="+type,
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
    return io('http://localhost:3000');
}

export let createConnection = async (localstream,limit) => {
    let config = {iceServers:[{urls:"stun:stun4.l.google.com:19302"}]};
}

export let changePass = async (userid,oldpassword,newpassword) => {
    let response;
    await $.ajax({
        type:'put',
        url:'http://localhost:3000/api/change-password',
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

export let logout = () =>
{
    document.cookie = "_user" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('profile');
    history.go();
}