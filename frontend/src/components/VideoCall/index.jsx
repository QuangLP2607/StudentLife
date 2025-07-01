import { useEffect, useRef, useState } from "react";
import socket from "../../utils/socket";

const VideoCall = () => {
  const [myId, setMyId] = useState("");
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    const startCall = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideo.current.srcObject = stream;

      socket.on("connect", () => setMyId(socket.id));

      socket.emit("join-room", "room1"); // dùng room cố định hoặc nhận prop room

      socket.on("user-joined", (userId) => {
        peerRef.current = createPeer(userId, stream);
      });

      socket.on("offer", async ({ from, offer }) => {
        const peer = createAnswerPeer(from, stream);
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answer", { to: from, answer });
      });

      socket.on("answer", async ({ answer }) => {
        await peerRef.current.setRemoteDescription(answer);
      });

      socket.on("ice-candidate", ({ candidate }) => {
        peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      });
    };

    startCall();
  }, []);

  const createPeer = (toId, stream) => {
    const peer = new RTCPeerConnection();
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", { to: toId, candidate: e.candidate });
      }
    };

    peer.ontrack = (e) => {
      remoteVideo.current.srcObject = e.streams[0];
    };

    peer.createOffer().then((offer) => {
      peer.setLocalDescription(offer);
      socket.emit("offer", { to: toId, offer });
    });

    return peer;
  };

  const createAnswerPeer = (fromId, stream) => {
    const peer = new RTCPeerConnection();
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", { to: fromId, candidate: e.candidate });
      }
    };

    peer.ontrack = (e) => {
      remoteVideo.current.srcObject = e.streams[0];
    };

    return peer;
  };

  return (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      <p>Your ID: {myId}</p>
      <video
        ref={localVideo}
        autoPlay
        playsInline
        muted
        style={{ width: "300px" }}
      />
      <video
        ref={remoteVideo}
        autoPlay
        playsInline
        style={{ width: "300px" }}
      />
    </div>
  );
};

export default VideoCall;
