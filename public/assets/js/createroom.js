$(document).ready(function(){
    //change room type
    $("#roomtype").on('change',function(){
        let type = $(this).val();
        if(type == "private")
        {
            $("#roompass").removeAttr('disabled');
        }
        else
        {
            $("#roompass").val('none');
            $("#roompass").attr('disabled','disabled');
        }
    });

    //create room coding
    $(".create_room").submit(async function(e){
        e.preventDefault();
        await $.ajax({
            type:'post',
            url:'http://localhost:3000/api/quickroom',
            data: new FormData(this),
            contentType:false,
            processData:false,
            cache:false,
            beforeSend:function(req){$("#createroombtn").html('<i class="fa fa-circle-o-notch text-warning fa-spin" aria-hidden="true"></i>');},
            success:function(res)
            {
                if(res.status == true)
                {
                   $("#createroombtn").html('<i class="fa fa-check-circle text-success" aria-hidden="true"></i>'); 
                   let html = 
                    `<div class="toast show bg-dark animate__animated animate_pulse" id="toast">
                        <div class="toast-header bg-dark">
                        <span class="text-danger">Message</span>   
                        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                        </div>
                        <div class="toast-body text-success text-center">
                            Room Created SuccessFully <i class="fa fa-check-circle text-warning"></i>
                        </div>
                    </div>`;
                    $(".toastmessage").html(html);
                   setTimeout(() => {
                    $("#createroombtn").html('Create Room');
                    $(".create_room")[0].reset();
                    $(".toastmessage").html('');
                    history.go();
                    $("#myrooms").click();
                   },2000);
                }
                if(res.status == false)
                {
                    $("#createroombtn").html('<i class="fa fa-check-circle text-success" aria-hidden="true"></i>'); 
                   let html = 
                    `<div class="toast show bg-dark animate__animated animate_pulse" id="toast">
                        <div class="toast-header bg-dark">
                        <span class="text-danger">Message</span>   
                        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                        </div>
                        <div class="toast-body text-success text-center">
                            ${res.message} <i class="fa fa-times text-danger"></i>
                        </div>
                    </div>`;
                    $(".toastmessage").html(html);
                   setTimeout(() => {
                    $("#createroombtn").html('Create Room');
                    $(".create_room")[0].reset();
                    $(".toastmessage").html('');
                   },2000);
                }
            }
        });
    });
    //create room coding end
})