"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Volume2, VolumeX, Maximize2, Users } from "lucide-react";

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

interface StreamViewerProps {
  streamId: string;
  viewerCount: number;
}

export function StreamViewer({ streamId, viewerCount }: StreamViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<any>(null);
  const viewerIdRef = useRef<string>(crypto.randomUUID());

  const [muted, setMuted] = useState(false);
  const [connected, setConnected] = useState(false);
  const [liveCount, setLiveCount] = useState(viewerCount);

  useEffect(() => {
    const supabase = createClient();
    const viewerId = viewerIdRef.current;

    const channel = supabase.channel(`stream:${streamId}`, {
      config: { broadcast: { ack: false } },
    });

    channel
      // Receive offer from host
      .on("broadcast", { event: "offer" }, async ({ payload }: { payload: { viewerId: string; sdp: RTCSessionDescriptionInit } }) => {
        if (payload.viewerId !== viewerId) return;

        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        pcRef.current = pc;

        // Receive remote stream
        pc.ontrack = (event) => {
          if (videoRef.current && event.streams[0]) {
            videoRef.current.srcObject = event.streams[0];
            setConnected(true);
          }
        };

        // Send ICE candidates to host
        pc.onicecandidate = ({ candidate }) => {
          if (candidate) {
            channel.send({
              type: "broadcast",
              event: "ice-from-viewer",
              payload: { viewerId, candidate },
            });
          }
        };

        pc.onconnectionstatechange = () => {
          if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
            setConnected(false);
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        channel.send({
          type: "broadcast",
          event: "answer",
          payload: { viewerId, sdp: answer },
        });
      })
      // Receive ICE from host
      .on("broadcast", { event: "ice-from-host" }, async ({ payload }: { payload: { viewerId: string; candidate: RTCIceCandidateInit } }) => {
        if (payload.viewerId !== viewerId || !pcRef.current) return;
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } catch {}
      })
      // Stream ended
      .on("broadcast", { event: "stream-ended" }, () => {
        setConnected(false);
        if (videoRef.current) videoRef.current.srcObject = null;
      })
      .subscribe(() => {
        // Notify host that we joined
        channel.send({
          type: "broadcast",
          event: "viewer-join",
          payload: { viewerId },
        });
      });

    channelRef.current = channel;

    return () => {
      // Notify host we left
      channel.send({
        type: "broadcast",
        event: "viewer-leave",
        payload: { viewerId },
      });
      pcRef.current?.close();
      supabase.removeChannel(channel);
    };
  }, [streamId]);

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen?.();
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Video */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video group">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className="w-full h-full object-cover"
        />

        {/* Connecting state */}
        {!connected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-white/70 text-sm">接続中...</p>
          </div>
        )}

        {/* Live badge */}
        {connected && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-live-pulse" />
              LIVE
            </span>
            <span className="flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              <Users size={11} />
              {liveCount}
            </span>
          </div>
        )}

        {/* Controls overlay (visible on hover) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
          <button
            onClick={() => setMuted((v) => !v)}
            className="text-white hover:text-[#C8F400] transition-colors"
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <div className="flex-1" />
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-[#C8F400] transition-colors"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
