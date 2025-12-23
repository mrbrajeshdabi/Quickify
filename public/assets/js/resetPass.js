$(document).ready(function(){
    $('.reset_password').submit(function(e){
        e.preventDefault();
        let remail = $("#resetemail").val();    
        $.ajax({
            type:'put',
            url:'https://quickify-fh37.onrender.com/api/reset-password?email='+remail,
            header:{'Content-Type':'application/json'},
            beforeSend:function(req){
                $("#resetpassbtn").html('<i class="fa fa-notch fa-spin"></i>');
            },
            success:function(res)
            {
                if(res.status == true)
                {
                    $("#verifyemail").val(remail);
                    $("#resetpassbtn").html("Otp Send SuccessFully <i class='fa fa-check-circle text-info ms-2'></i>");
                    setTimeout(() => {
                        $("#resetpassbtn").html('Send Reset Link');
                        $("#forgotcard").addClass('d-none');
                        $("#otp_verify").removeClass('d-none');
                        $("#usermemail").val(remail);
                    }, 2000);
                }
                else
                {
                    $("#resetpassbtn").html(res.message);
                    setTimeout(() => {
                        $("#resetpassbtn").html('Send Reset Link');
                    }, 1000);
                }
            }
        });
    });


    $(".otp_verify_frm_reset_password").submit(function(e){
        e.preventDefault();
        let one = $('#digit1').val();
        let two = $('#digit2').val();
        let three = $('#digit3').val();
        let four = $('#digit4').val();
        let five = $('#digit5').val();
        let six = $('#digit6').val();
        let otp = one + two + three + four + five + six;
        $.ajax({
            type:'put',
            url : 'https://quickify-fh37.onrender.com/api/verify-otp', //https://quickify-fh37.onrender.com
            headers:{"Content-Type":"appliction/json",'x-verify-otp':otp,'x-email':$("#verifyemail").val(),'x-powered-by':"mr_brajesh_dabi"},
            beforeSend:function(req){
                $("#verifybtn").removeClass('btn btn-light');
                $("#verifybtn").addClass('btn btn-dark');
                $("#verifybtn").html('<i class="fa fa-circle-notch text-light fa-spin" aria-hidden="true"></i>');
            },
            success:function(res)
            {
                if(res.status == true)
                {
                    $("#verifybtn").removeClass('btn btn-dark');
                    $("#verifybtn").addClass('btn btn-light');
                    $("#verifybtn").html('<i class="fa fa-check-circle text-primary" aria-hidden="true"></i>');  
                    setTimeout(() => {
                        $(".otp_verify_frm_reset_password")[0].reset();
                        $("#otp_verify").addClass('d-none');
                        $("#forgotcard").addClass('d-none');
                        $("#changepass").removeClass('d-none');
                    }, 1000); 
                }
                else
                {
                    $("#verifybtn").removeClass('btn btn-dark');
                    $("#verifybtn").addClass('btn btn-danger');
                    $("#verifybtn").html(res.message);
                    setTimeout(() => {
                        $(".otp_verify_frm")[0].reset();
                        $("#verifybtn").removeClass('btn btn-danger');
                        $("#verifybtn").addClass('btn btn-light');
                        $("#verifybtn").html('Verify OTP');
                    }, 1000);   
                }
            }
        });
    });

    //create new password
    $('.new_password_frm').submit(function(e){
        e.preventDefault();
        let newpass = $("#newpass").val();
        let confirmpass = $("#confirmpass").val();
        let useremail = $("#usermemail").val();
        if(newpass == confirmpass){
            $.ajax({
                type:'put',
                url:'https://quickify-fh37.onrender.com/api/create-new-password',
                header:{'Content-Type':'application/json'},
                data:{
                    email : useremail,
                    newpassword : newpass,
                    confirmpassword : confirmpass
                },
                beforeSend:function(req){
                    $("#newpassbtn").html('<i class="fa fa-notch fa-spin"></i>');
                },
                success:function(res)
                {
                    $("#newpassbtn").html('Create Password');
                    if(res.status == true)
                    {
                        $("#newpassbtn").html('Password Changed Successfully <i class="fa fa-check-circle ms-1"></i>');
                        setTimeout(() => {
                            $("#newpassbtn").html('Please Login New Password');
                            history.go();
                        }, 2000);
                    }
                    else
                    {
                        $("#newpassbtn").html(res.message);
                        setTimeout(() => {
                            $("#newpassbtn").html('Create Password');
                        }, 1000);
                    }
                }
            });
        }
        else
        {
            $("#newpassbtn").html('Password Does Not Match');
            setTimeout(() => {
                $("#newpassbtn").html('Create Password');
            }, 1000);
        }
    });
});