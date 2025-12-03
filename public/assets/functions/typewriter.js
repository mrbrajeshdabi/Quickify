var  i = 0;
// var text =`'Video calling allows people to communicate face-to-face through the internet.
// It uses a camera, microphone, and internet connection.
// It is widely used for online classes, meetings, business, and personal communication.
// Apps like Zoom, Google Meet, and WhatsApp make video calling easy and effective.'`;
// var speed = 30;

export function typeWriter(text,speed,id)
{
    if(i < text.length)
    {
       document.getElementById('demo').innerHTML += text.charAt(i);
       i++; 
    }

    setTimeout(() => {
        typeWriter()
    }, speed);
}

