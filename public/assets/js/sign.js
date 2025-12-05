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

    $(".signup_frm").submit(function(e){
        e.preventDefault();
        $.ajax({
            type:'post',
            url :'https://quickify-fh37.onrender.com/api/quicksign', 
            data:new FormData(this),
            contentType:false,
            processData:false,
            cache:false,
            beforeSend:function(req)
            {
                $("#signup_frm_btn").removeClass('btn btn-light');
                $("#signup_frm_btn").addClass('btn btn-dark');
                $("#signup_frm_btn").html('<i class="fa fa-circle-o-notch text-warning fa-spin" aria-hidden="true"></i>');

            },
            success:function(res) {
                
                if(res.status == true)
                {
                    $('.picbox').removeClass('d-none');
                    $("#storeimg").attr('src','');
                    $("#signup_frm_btn").html('<i class="fa fa-check-circle text-success" aria-hidden="true"></i>')
                    setTimeout(() => {
                        $('.signup_frm')[0].reset();
                        $("#signup_frm_btn").addClass('btn btn-dark');
                        $("#signup_frm_btn").addClass('btn btn-light');
                        $("#signup_frm_btn").html('Sign');
                        $(".signup_frm").addClass('d-none');
                        $(".login_frm").removeClass('d-none');
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
});