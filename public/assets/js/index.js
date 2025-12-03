
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

