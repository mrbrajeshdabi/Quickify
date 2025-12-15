import { setCookie, setTokan } from "../functions/Quickify.js";

$(document).ready(function(){
    $(".login_frm").submit(function(e){
        e.preventDefault();
        $.ajax({
            type:'post',
            url:'https://quickify-fh37.onrender.com/api/quicklogin',//https://quickify-fh37.onrender.com
            header:{
                "content-type":'application/json'
            },
            data:{
                lemail : $("#lemail").val(),
                lpassword : $("#lpassword").val()
            },
            cache:false,
            beforeSend:function(req) {
                $("#login_frm_btn").html('<i class="fa fa-circle-notch text-dark fa-spin" aria-hidden="true"></i>')
            },
            success:function(res)
            {
                
                if(res.status == true)
                {
                    $("#login_frm_btn").html('Login');
                    setCookie('_user',res.session,30);
                    // setTokan(res.tokan);
                    localStorage.setItem('tokan',JSON.stringify(res.tokan));
                    localStorage.setItem('profile',JSON.stringify(res.user));
                    setTimeout(() => {
                        window.location.href='profile.html';
                    },1000);
                }
                else if(res.status == false)
                {
                    $("#login_frm_btn").removeClass('btn btn-light');
                    $("#login_frm_btn").addClass('btn btn-danger');
                    $("#login_frm_btn").html(res.message);
                    setTimeout(() => {
                        $("#login_frm_btn").html('Login');
                        $("#login_frm_btn").removeClass('btn btn-danger');
                        $("#login_frm_btn").addClass('btn btn-light');
                    },1000);
                }
            }
        });
    });
});