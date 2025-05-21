import { useEffect, useState } from "react";

export function Sender(){
    const [socket , setSocket] = useState<WebSocket | null>(null);
    const [pc, setPc] = useState<RTCPeerConnection | null>(null);
    console.log(pc);

    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8080");
        setSocket(socket);
        socket.onopen =()=>{
            console.log("WebSocket connection established");
            socket.send(JSON.stringify({
                type : "sender"
            }))
        }
    }, []);

    const initiateConn = async () =>{
        console.log("Initiating connection");
        if(!socket){
            alert("Socket not connected");
            return;
        }

        socket.onmessage = async(event) =>{
            const message = JSON.parse(event.data);
            if(message.type === "createAnswer"){
                await pc?.setRemoteDescription(message.sdp);
            }
            else if(message.type === 'iceCandidate'){
                await pc?.addIceCandidate(message.candidate);
            }
        }
        const pc = new RTCPeerConnection();
        setPc(pc);
        pc.onicecandidate =(event)=>{
            if(event.candidate){
                socket?.send(JSON.stringify({
                    type : "icecandidate",
                    candidate : event.candidate
                }))
            }
        }
        pc.onnegotiationneeded = async () =>{
            const offer = await pc?.createOffer();
            await pc?.setLocalDescription(offer);
            socket?.send(JSON.stringify({
                type:"createOffer",
                sdp:pc.localDescription
            }));
        }

        const getCameraStreamAndSend = (pc: RTCPeerConnection) => {
            navigator.mediaDevices.getUserMedia({video:true}).then(stream =>{
                const video = document.createElement("video");
                video.srcObject = stream;
                video.play();

                document.body.appendChild(video);
                stream.getTracks().forEach(track => {
                    pc.addTrack(track, stream);
                });
            });
        };

        getCameraStreamAndSend(pc);
    }
    return <div>
        Sender
        <button onClick={initiateConn}>Send data</button>
    </div>
    
}