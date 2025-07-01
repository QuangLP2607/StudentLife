import React from "react";
import VideoCall from "@/components/VideoCall";

export default function Projects() {
  const roomId = "abc123"; // hoặc lấy từ URL/query string

  return (
    <div>
      <h2>Video Call Room</h2>
      {/* <VideoCall roomId={roomId} /> */}
    </div>
  );
}
