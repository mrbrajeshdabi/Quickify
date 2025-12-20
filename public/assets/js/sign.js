$(document).ready(function(){
    $('#profilepic').on('change',function(e){
        
        let filename = e.target.files[0];
        let size = filename.size;
        let reader = new FileReader();
        reader.readAsDataURL(filename);
        reader.onprogress=function(event)
        {
            $("#storeimg").attr('src','');
            const percentComplete = (event.loaded / event.total) * 100;
            document.querySelector('.progress').classList.remove('d-none');
            document.querySelector('.progress-bar').style.width=`${percentComplete}%`;
            document.querySelector('.progress-bar').innerHTML = `${percentComplete}%`;
        }
        reader.onload = function()
        {
            document.querySelector('.progress-bar').innerHTML = `Upload Success`;
            setTimeout(() => {
                document.querySelector('.progress').classList.add('d-none');
            }, 1000);
            $('.picbox').removeClass('d-none');
            $("#storeimg").attr('src',reader.result);
        }

    });

    // $("#password").on('input',function(){
    //     if($('#email').val().length >= 1 && $('#username').val().length >= 1 && $('#mobilenumber').val().length >= 1 && $('#password').val().length >= 1)
    //     {
    //         $("#sendotp").removeClass('d-none');
    //     }
    //     else
    //     {
    //         $("#sendotp").addClass('d-none');
    //     }
    // });

    // //generate otp
    // $("#sendotp").click(function(){
    //     if($('#email').val().length >= 1 && $('#username').val().length >= 1 && $('#mobilenumber').val().length >= 1 && $('#password').val().length >= 1)
    //     {
    //         $("#sendotp").removeClass('d-none');
    //         $.ajax({
    //         type:'get',
    //         url:'https://quickify-fh37.onrender.com/api/sendotp?email='+$('#email').val(),
    //         beforeSend:function(req){$(this).html('Please Wait..')},
    //         success:function(res)
    //         {
    //             $('#otp').val(res.otp);
    //             $('#sendotp').addClass('d-none');
    //             $(this).html('Generate Otp');
    //             $("#signup_frm_btn").removeClass('d-none');
    //         }
    //         });
    //     }
    //     else
    //     {
    //         $(this).html('Please Filled All Value');
    //         setTimeout(() => {
    //             $(this).html('Generate Otp');
    //         }, 1000);
    //     }
    // });

    $(".signup_frm").submit(function(e){
        e.preventDefault(); 
        $.ajax({
            type:'post',
            url:'https://quickify-fh37.onrender.com/api/quicksign', // https://quickify-fh37.onrender.com
            data:new FormData(this),
            contentType:false,
            processData:false,
            cache:false,
            beforeSend:function(req)
            {
                $("#signup_frm_btn").removeClass('btn btn-light');
                $("#signup_frm_btn").addClass('btn btn-dark');
                $("#signup_frm_btn").html('<i class="fa fa-circle-notch text-light fa-spin" aria-hidden="true"></i>');

            },
            success:function(res) {
                if(res.status == true)
                {
                    $("#verifyemail").val(res.email);
                    $('.picbox').removeClass('d-none');
                    $("#storeimg").attr('src','');
                    $("#signup_frm_btn").html('<i class="fa fa-check-circle text-primary" aria-hidden="true"></i>')
                    setTimeout(() => {
                        $('.signup_frm')[0].reset();
                        $("#signup_frm_btn").addClass('btn btn-dark');
                        $("#signup_frm_btn").addClass('btn btn-light');
                        $("#signup_frm_btn").html('Sign');
                        $("#signupcard").addClass('d-none');
                        $("#otp_verify").removeClass('d-none');
                    }, 1000);
                }
                else
                {
                    $("#signup_frm_btn").html(res.message);
                    setTimeout(() => {
                        $("#signup_frm_btn").addClass('btn btn-dark');
                        $("#signup_frm_btn").addClass('btn btn-light');
                        $("#signup_frm_btn").html('Sign');
                    },1000);
                }
            }
        
        });
    });


    $(".otp_verify_frm").submit(function(e){
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
                        $(".otp_verify_frm")[0].reset();
                        $("#otp_verify").addClass('d-none');
                        window.location.href='login.html';
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
});