
document.querySelector('#notauser').addEventListener('click',opensign);
document.querySelector('#alreadysign').addEventListener('click',openlogin);
function opensign()
{
    document.querySelector('.login_frm').classList.add('d-none');
    document.querySelector('.signup_frm').classList.remove('d-none');
}
function openlogin()
{
    document.querySelector('.signup_frm').classList.add('d-none');   
    document.querySelector('.login_frm').classList.remove('d-none');
}

// async function requestNotification(params) {
//     let permission = Notification.requestPermission();
//     if(permission == "denied")
//     {
//         alert("PLease Enalbled Permisiion Othervise Sender Call Not Recived");
        
//     }
// }
// requestNotification();



