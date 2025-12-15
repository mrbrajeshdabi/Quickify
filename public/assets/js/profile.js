import { changePass, checkcookie, deactivatedAccount, logout, roomcreaterid, todayDate, token,userprofile} from "../functions/Quickify.js";
$(document).ready(function(){
    let userid;
    //room created data fetch
    roomcreaterid().then((createrid)=>{
        userid = createrid;
    });

    $("#logout").click(function(){
        logout();
    });

    //set update frm value
    userprofile().then((user)=>{
        $("#email").val(user.email);
        $("#username").val(user.username);
        $("#mobilenumber").val(user.mobilenumber);
        $("#cpuserid").val(user._id);
        $("#updateuserid").val(user._id);
    });

    //setting function
    $("#openchangepasswordform").click(function(){
        $("#setting").addClass('d-none');
        $("#updatefrmcard").addClass('d-none');
        $("#changepasscard").removeClass('d-none');
    });

    $("#closepassfrm").click(function(){
        $("#updatefrmcard").addClass('d-none');
        $("#changepasscard").addClass('d-none');
        $("#setting").removeClass('d-none');
    });

    $("#openupdateform").click(function(){
        $("#setting").addClass('d-none');
        $("#changepasscard").addClass('d-none');
        $("#updatefrmcard").removeClass('d-none');
    });

    $("#closeupdatefrm").click(function(){
        $("#updatefrmcard").addClass('d-none');
        $("#changepasscard").addClass('d-none');
        $("#setting").removeClass('d-none');
    });

    //delete account
    $("#deleteaccount").click( async function(){
        let password = window.prompt("Enter password :  ");
        if(password != '' && password != null)
        {
            let confirmpass = window.prompt('Enter Confirm Password - ');
            if(confirmpass != '' && confirmpass != null)
            {
                if(password == confirmpass)
                {
                    let confirm = window.confirm('Are You Sure delete account : ');
                    if(confirm == true)
                    {
                        let id = await roomcreaterid();
                        deactivatedAccount(id,confirmpass).then((res)=>{
                            if(res.status == true)
                            {
                                let remove = localStorage.removeItem('profile');
                                if(remove == undefined)
                                {
                                    logout();
                                }
                            }
                        });
                    }
                }
                else
                {
                    alert('Password Not Matched');
                }
            }
        }
    });

    //change password 
    $(".change-pass").submit(function(e){
        e.preventDefault();
        let oldpass = $("#oldpass").val();
        let newpass = $("#newpass").val();
        let confirmp = $("#confirmpass").val();
        let userid = $("#cpuserid").val();
        if(newpass == confirmp)
        {
            changePass(userid,oldpass,confirmp).then((res)=>{
                if(res.status == true)
                {
                    $("#changepassbtn").removeClass('btn btn-primary');
                    $("#changepassbtn").addClass('btn btn-success');
                    $("#changepassbtn").html("created new password success");
                    setTimeout(() => {
                        $("#changepassbtn").removeClass('btn btn-success');
                        $("#changepassbtn").addClass('btn btn-primary');
                        $("#changepassbtn").html("Change password");
                        $(".change-pass")[0].reset();
                        $("#closepassfrm").click();
                    },1000);
                }
                else
                {
                    $("#changepassbtn").removeClass('btn btn-primary');
                    $("#changepassbtn").addClass('btn btn-danger');
                    $("#changepassbtn").html(res.message);
                    setTimeout(() => {
                        $("#changepassbtn").removeClass('btn btn-danger');
                        $("#changepassbtn").addClass('btn btn-primary');
                        $("#changepassbtn").html("Change password");
                    },1000);
                }
            });
        }
        else
        {
            $("#changepassbtn").removeClass('btn btn-primary');
            $("#changepassbtn").addClass('btn btn-danger');
            $("#changepassbtn").html("password does not match");
            setTimeout(() => {
                $("#changepassbtn").html("Change password");
                $("#changepassbtn").removeClass('btn btn-danger');
                $("#changepassbtn").addClass('btn btn-primary');
            },1000);
        }
    });

    // update account
    $(".update_frm").submit(function(e){
        e.preventDefault();
        $.ajax({
        type:'put',
        url:'https://quickify-fh37.onrender.com/api/update-profile',
        data : new FormData(this),
        contentType:false,
        processData:false,
        cache:false,
        beforeSend:function(req)
        {
            $("#updatefrmbtn").removeClass('btn btn-primary');
            $("#updatefrmbtn").addClass('btn btn-dark');
            $("#updatefrmbtn").html('<i class="fa fa-circle-notch fa-spin text-dark" aria-hidden="true"></i>')
        },
        success:function(res)
        {
            if(res.status == true)
            {
                $("#updatefrmbtn").removeClass('btn btn-dark');
                $("#updatefrmbtn").addClass('btn btn-primary');
                $("#updatefrmbtn").html('update account');
                localStorage.setItem('profile',JSON.stringify(res.data));
                let html = 
                `<div class="toast show bg-dark animate__animated animate__pulse" id="toast">
                    <div class="toast-header bg-dark">
                    <span class="text-danger">Message</span>   
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body text-success text-center">
                        Your Profile Is Update Successfully <i class="fa fa-check-circle text-warning"></i>
                    </div>
                </div>`;
                $(".toastmessage").html(html);

                setTimeout(() => {
                    $(".toastmessage").html('');
                    $("#closeupdatefrm").click();
                    setTimeout(() => {
                        history.go();
                    },1000);
                }, 2000);
            }
            else
            {
                console.log(res.message);
            }
        }
    });
    });

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

