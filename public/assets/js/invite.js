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
       $("#adduserbtn").html('<i class="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i>');
        addCustomUser(type,sid,rid).then((res)=>{
            $("#adduserbtn").html('Add User');
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
                    socket.emit('customuseradd',sid);
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
        $("#listusericon").removeClass('fa fa-users')
        $("#listusericon").addClass('fa fa-circle-o-notch fa-spin');
        getCustomUser(sid).then((res)=>{
            $("#listusericon").removeClass(' fa fa-circle-o-notch fa-spin')
            $("#listusericon").addClass('fa fa-users');
            if(res.status == true)
            {
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
                                    <button class="btn btn-primary ms-5 w-50" type="button" id="call${index.rid}" rid="${index.rid}"><i class="fa fa-video animate__animated animate__pulse animate__infinite"></i></button>
                                    <button class="btn btn-danger ms-5  w-50" type="button" id="delete${index.rid}" deleteid="${index._id}"><i class="fa fa-trash animate__animated animate__pulse animate__infinite"></i></button>
                                </div>
                            </li>
                        `;
                        $("#inserusercustom").append(html);
                    });
                }
                else
                {
                    let html = 
                        `
                        <li class="list-group-item">
                             <span class="text-warning"> No Users Added </span>   
                        </li>
                        `;
                        $("#inserusercustom").html(html);
                }
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
                        <button class="btn btn-primary ms-5" type="button" id="call${index.rid}" rid="${index.rid}"><i class="fa fa-video animate__animated animate__pulse animate__infinite"></i></button>
                        <button class="btn btn-danger ms-5" type="button" id="delete${index.rid}" deleteid="${index._id}"><i class="fa fa-trash animate__animated animate__pulse animate__infinite"></i></button>
                    </div>
                </li>
            `;
            $("#inserusercustom").append(html);
        });
    });
});