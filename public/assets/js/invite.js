import { addCustomUser, getCustomUser, roomcreaterid } from "../functions/Quickify.js";

$(document).ready(function(){
    let socket = io();
    let type;
    $("#type").click(function(){
       type =  $(this).val();
       let html =
        `
        <label> Enter Your ${type} </label>
        <input type='${type}' id='${type}' name='${type}' required />

       `;
       $("#insertinput").html(html);
       $("#adduserbtn").removeClass('disabled');
       $("#adduserbtn").addClass('animate__animated animate__pulse');
    });

    $(".choosesearch").submit( async function(e){
        e.preventDefault();
       let rid =  $(`#${type}`).val();
       let sid = await roomcreaterid();
        addCustomUser(type,sid,rid).then((res)=>{
            if(res.status == true)
            {
                let html = 
                `
                <div class="toast show bg-dark animate__animated animate__pulse" id="toast">
                    <div class="toast-header bg-dark">
                    <span class="text-danger">Message</span>   
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body text-success text-center">
                        User Add Successfully <i class="fa fa-check-circle text-warning"></i>
                    </div>
                </div>
                `;
                $(".toastmessage").html(html);
                setTimeout(() => {
                    $(".toastmessage").html('');
                    $(".choosesearch")[0].reset();
                    $("#listusericon").addClass('text-success animate__infinite');
                }, 2000);
            }
            else
            {
                alert(res.message);
            }
        });
    });


    //offline get custom user
    roomcreaterid().then((sid)=>{
        getCustomUser(sid).then((res)=>{
            if(res.data.length > 1)
            {
                res.data.forEach(index => {
                    let html = 
                    `
                    <li class="list-group-item">
                            <div class="d-flex">
                                <img src="../usersprofilepic/${index.rpic}" class="img-fluid img-thumbnail profilepicroom" id="profilepicroom">
                                <span class="ms-5 mt-2">${index.rusername}</span>
                                <span class="ms-5 mt-2">${index.rstatus}</span>
                                <button class="btn btn-primary ms-5 w-50" type="button" id="${index.rid}" rid="${index.rid}"><i class="fa fa-video"></i></button>
                            </div>
                        </li>
                    `;
                    $("#inserusercustom").append(html);
                });
            }
            else
            {
                console.log(res);
            }
        });
    });

    //online get custom user
    socket.on('customuseradd',(array)=>{
        array.forEach(index => {
            let html = 
            `
            <li class="list-group-item">
                    <div class="d-flex">
                        <img src="../usersprofilepic/${index.rpic}" class="img-fluid img-thumbnail profilepicroom" id="profilepicroom">
                        <span class="ms-5 mt-2">${index.rusername}</span>
                        <span class="ms-5 mt-2">${index.rstatus}</span>
                        <button class="btn btn-primary ms-5 w-50" type="button" id="${index.rid}" rid="${index.rid}"><i class="fa fa-video"></i></button>
                    </div>
                </li>
            `;
            $("#inserusercustom").append(html);
        });
    });
});