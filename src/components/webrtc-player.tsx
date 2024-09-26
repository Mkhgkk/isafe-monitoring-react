import React, { useEffect, useRef } from "react";
import config from "../config/default.config";

interface WebRTCPlayerProps {
  streamId: string;
}

const WebRTCPlayer: React.FC<WebRTCPlayerProps> = ({ streamId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const startWebRTC = async () => {
      try {
        // Initialize a new RTCPeerConnection
        peerConnection.current = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" }, // Replace with your STUN/TURN servers if necessary
          ],
        });

        // Handle the incoming remote stream
        peerConnection.current.ontrack = (event) => {
          console.log("Track received:", event);
          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
          }
        };

        // Log WebRTC connection state changes
        peerConnection.current.oniceconnectionstatechange = () => {
          console.log(
            "ICE connection state:",
            peerConnection.current?.iceConnectionState
          );
          if (
            peerConnection.current?.iceConnectionState === "failed" ||
            peerConnection.current?.iceConnectionState === "disconnected"
          ) {
            console.error("WebRTC ICE connection failed or disconnected.");
          }
        };

        // Handle gathering of ICE candidates (Trickle ICE)
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("ICE candidate gathered:", event.candidate);
          } else {
            console.log("ICE candidate gathering complete.");
          }
        };

        // Create an SDP offer (without waiting for ICE candidates)
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        console.log("Sending SDP Offer to WHEP server:", offer.sdp);

        // Send the offer to the WHEP server
        const response = await fetch(
          `http://${config.WEBRTC_STREAM_URL}/${streamId}/whep`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/sdp", // Send as raw SDP
            },
            body: offer.sdp, // Send the offer's SDP directly
          }
        );

        if (!response.ok) {
          const responseBody = await response.text();
          throw new Error(
            `Failed to fetch the WHEP server: ${response.statusText}, Body: ${responseBody}`
          );
        }

        // Receive the SDP answer from the server
        const answerSdp = await response.text();
        console.log("SDP Answer from server:", answerSdp);

        // Set the remote SDP answer
        const remoteDesc = new RTCSessionDescription({
          sdp: answerSdp,
          type: "answer",
        });
        await peerConnection.current.setRemoteDescription(remoteDesc);
      } catch (error) {
        console.error("Error in WebRTC connection:", error);
      }
    };

    startWebRTC();

    return () => {
      // Cleanup the peer connection and stop media tracks
      if (peerConnection.current) {
        peerConnection.current.close();
      }

      if (videoRef.current && videoRef.current.srcObject) {
        const mediaStream = videoRef.current.srcObject as MediaStream;
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [streamId]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        controls={true} // Add controls temporarily for debugging autoplay issues
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

export default WebRTCPlayer;
