export let PC = (function(){

    let peerconnection;
    let createPeerConnetion = ()=>{
        let config = {iceServers:[{urls:"stun:stun4.l.google.com:19302"}]};
        peerconnection = new RTCPeerConnection(config);

        //gettracks
        localstream.getTracks().forEach(track => {
            peerconnection.addTrack(track,localstream);
        });

        //ontrack
        peerconnection.ontrack = function(event)
        {
            //create reciver video
            let video = document.createElement("video");
            video.setAttribute('class','img-fluid img-thumbnail rivideo');
            video.autoplay = true;
            video.playsInline = true;
            video.srcObject = event.streams[0];
            document.querySelector(".rvideobox").append(video);
        }

        //onicecandidate
        peerconnection.onicecandidate = function(event)
        {
            if(event.candidate)
            {
                //socket send candidate to from
            }
        }

        return peerconnection;
    }


    return {
        getInstance : ()=>{
            if(!peerconnection)
            {
                peerconnection = createPeerConnetion();
            }
            return peerconnection;
        }
    }
})();