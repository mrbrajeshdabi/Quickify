import { searchuser } from "../functions/Quickify.js";

$(document).ready(function(){
    $(".search_user_frm").submit(function(e){
        e.preventDefault();
    });

    $("#searchuser").on('input',function(){
        if($(this).val().length == 0)
        {
            $("#searchresult").addClass('d-none');
            $("#insertsearchuser").html('');
            $('#userprofile').removeClass('d-none');
        }
        else
        { 
            searchuser($(this).val()).then((res)=>{
                $("#listcustomuser").addClass('d-none');
                $('#setting').addClass('d-none');
                $('#userprofile').addClass('d-none');
                $('#myroom').addClass('d-none');
                $("#calling").addClass('d-none');
                $("#addcustomuser").addClass('d-none');
                $("#createroom").addClass('d-none');
                $("#searchresult").removeClass('d-none');
                if(res.status == true){
                    if(res.array.length != 0)
                    {
                        res.array.forEach(searchuser => {
                                searchuser.forEach(user =>{
                                    let html = 
                                    `
                                    <li class="list-group-item">
                                    <div class="d-flex">
                                        <img src="${user.userpic}" class=" ms-5 mt-2 img-fluid img-thumbnail profilepicroom" />
                                        <p class="ms-5 mt-3">${user.username}</p>
                                        <button class="btn btn-light ms-5 showid" getid='${user.inviteid}'><i class="fa fa-eye"></i></button>
                                        <input type="password" id="inviteid${user.inviteid}" name="inviteid" class="ms-5 w-50" disabled value='${user.inviteid}'>
                                    </div>
                                </li>

                                `;
                                  $("#insertsearchuser").html(html);
                                });
                        });
                    }
                }
                else
                {
                    let html = 
                        `
                        <li class="list-group-item">
                        <div class="d-flex">
                            <p class="ms-5 mt-2 text-warning">No User Found</p>
                        </div>
                       </li>
                    `;
                      $("#insertsearchuser").html(html);
                }
                $(".showid").each(function(){
                    $(this).click(function(){
                       let id =  $(this).attr('getid');
                       let type =  $(`#inviteid${id}`).attr('type');
                       if(type == 'password')
                       {
                            $(this).html('<i class="fa fa-eye-slash text-danger">');
                            $(`#inviteid${id}`).removeAttr('disabled');
                            $(`#inviteid${id}`).removeAttr('type','password');
                            $(`#inviteid${id}`).attr('type','text');
                       }
                       else
                       {
                            $(this).html('<i class="fa fa-eye text-dark">');
                            $(`#inviteid${id}`).removeAttr('type','text');
                            $(`#inviteid${id}`).attr('disabled','disabled');
                            $(`#inviteid${id}`).attr('type','password');
                       }
                    });
                })
            });
        }
    });
});