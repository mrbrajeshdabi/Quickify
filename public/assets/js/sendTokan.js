import { sendTokanAndReciveruser, setCookie, userprofile } from "../functions/Quickify.js";

$(document).ready(function(){
    let tokan = window.location.search.split('?tokan=')[1];
    sendTokanAndReciveruser(tokan).then((res)=>{
        setCookie('_user',res.session,30);
        localStorage.setItem('profile',JSON.stringify(res.user));

        userprofile().then((data)=>{
        //setcreate room createrid
        $("#createrid").val(data._id);
        let html =
        `<center>
                <div class="profilebox mb-3">
                    <div class="imgbox">
                    <img src="${data.profilepic}" class="img-fluid img-thumbnail" id="profileimg">
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table">
                    <tr>
                        <td>Username</td>
                        <td>${data.username}</td>
                        <td>Invite Id</td>
                        <td>${data._id}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>${data.email}</td>
                        <td>Mobile Number</td>
                        <td>${data.mobilenumber}</td>
                    </tr>
                    <tr>
                        <td>Total Created Room</td>
                        <td>coming</td>
                        <td>Total Add Custom User</td>
                        <td>coming</td>
                    </tr>
                    <tr>
                        <td>Likes</td>
                        <td><button class="btn btn-light text-dark" type="button" disabled>Coming</button></td>
                        <td>Profile View</td>
                        <td><button class="btn btn-light text-dark" type="button" disabled>Coming</button></td>
                    </tr>

                </table>
                </div>
    </center>`;
    $("#insertprofile").html(html);
    
        });
    });
});