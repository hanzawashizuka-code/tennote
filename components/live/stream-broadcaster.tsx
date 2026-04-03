"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { endStream, goLive } from "@/actions/live";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, Wifi } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

interface StreamBroadcasterProps {
  streamId: string;
}

export function StreamBroadcaster({ streamId }: StreamBroadcasterProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const channelRef = useRef<any>(null);

  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [status, setStatus] = useState<"setup" | "live" | "ended">("setup");

  // Start camera
  useEffect(() => {
    let stream: MediaStream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        toast.error("カメラ・マイクへのアクセスを許可してください");
      }
    })();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Handle new viewer connecting
  const handleViewerJoin = useCallback(async (viewerId: string) => {
    if (!localStreamRef.current || !channelRef.current) return;

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    peersRef.current.set(viewerId, pc);

    // Add local tracks to peer connection
    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current!);
    });

    // Send ICE candidates to this viewer
    pc.onicecandidate = ({ candidate }) => {
      if (candidate && channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "ice-from-host",
          payload: { viewerId, candidate },
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        pc.close();
        peersRef.current.delete(viewerId);
        setViewerCount((c) => Math.max(0, c - 1));
      }
    };

    // Create offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    channelRef.current.send({
      type: "broadcast",
      event: "offer",
      payload: { viewerId, sdp: offer },
    });
  }, []);

  // Handle answer from viewer
  const handleAnswer = useCallback(async (viewerId: string, sdp: RTCSessionDescriptionInit) => {
    const pc = peersRef.current.get(viewerId);
    if (!pc) return;
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
  }, []);

  // Handle ICE from viewer
  const handleIceFromViewer = useCallback(async (viewerId: string, candidate: RTCIceCandidateInit) => {
    const pc = peersRef.current.get(viewerId);
    if (!pc) return;
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch {}
  }, []);

  // Set up signaling channel
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`stream:${streamId}`, {
      config: { broadcast: { ack: false } },
    });

    channel
      .on("broadcast", { event: "viewer-join" }, ({ payload }: { payload: { viewerId: string } }) => {
        setViewerCount((c) => c + 1);
        handleViewerJoin(payload.viewerId);
      })
      .on("broadcast", { event: "viewer-leave" }, ({ payload }: { payload: { viewerId: string } }) => {
        const pc = peersRef.current.get(payload.viewerId);
        if (pc) { pc.close(); peersRef.current.delete(payload.viewerId); }
        setViewerCount((c) => Math.max(0, c - 1));
      })
      .on("broadcast", { event: "answer" }, ({ payload }: { payload: { viewerId: string; sdp: RTCSessionDescriptionInit } }) => {
        handleAnswer(payload.viewerId, payload.sdp);
      })
      .on("broadcast", { event: "ice-from-viewer" }, ({ payload }: { payload: { viewerId: string; candidate: RTCIceCandidateInit } }) => {
        handleIceFromViewer(payload.viewerId, payload.candidate);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [streamId, handleViewerJoin, handleAnswer, handleIceFromViewer]);

  const startLive = async () => {
    const result = await goLive(streamId);
    if (result.error) { toast.error(result.error); return; }
    setIsLive(true);
    setStatus("live");
    toast.success("ライブ配信を開始しました！");
  };

  const stopLive = async () => {
    // Close all peer connections
    peersRef.current.forEach((pc) => pc.close());
    peersRef.current.clear();

    // Notify viewers
    channelRef.current?.send({
      type: "broadcast",
      event: "stream-ended",
      payload: {},
    });

    await endStream(streamId);
    setStatus("ended");
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    toast.success("配信を終了しました");
    router.push("/live");
  };

  const toggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setMicOn((v) => !v);
  };

  const toggleCam = () => {
    localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
    setCamOn((v) => !v);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Video preview */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Status overlay */}
        {status === "live" && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-live-pulse" />
              LIVE
            </span>
            <span className="flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              <Users size={11} />
              {viewerCount}
            </span>
          </div>
        )}

        {status === "setup" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 text-white text-sm px-4 py-2 rounded-xl backdrop-blur-sm">
              配信準備中 — カメラを確認してください
            </div>
          </div>
        )}

        {!camOn && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <VideoOff size={48} className="text-gray-600" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMic}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            micOn ? "bg-blue-100 text-[#1B4FD8]" : "bg-red-100 text-red-600"
          }`}
        >
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={toggleCam}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            camOn ? "bg-blue-100 text-[#1B4FD8]" : "bg-red-100 text-red-600"
          }`}
        >
          {camOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        <div className="flex-1" />

        {status === "setup" && (
          <button
            onClick={startLive}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-red-600/30"
          >
            <Wifi size={18} />
            配信開始
          </button>
        )}

        {status === "live" && (
          <button
            onClick={stopLive}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-2xl transition-all"
          >
            <PhoneOff size={18} />
            配信終了
          </button>
        )}
      </div>

      {/* Tips */}
      {status === "setup" && (
        <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
          <p className="font-semibold mb-1">📡 配信のヒント</p>
          <ul className="space-y-1 text-blue-600">
            <li>• カメラとマイクが正常に映っていることを確認してください</li>
            <li>• 安定したWi-Fi環境での配信を推奨します</li>
            <li>• 「配信開始」を押すと視聴者が参加できます</li>
          </ul>
        </div>
      )}
    </div>
  );
}
