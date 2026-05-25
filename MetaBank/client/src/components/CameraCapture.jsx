import React, { useRef, useEffect, useState } from 'react';

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let mounted = true;
    async function start() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        if (mounted) {
          setStream(s);
          if (videoRef.current) videoRef.current.srcObject = s;
        }
      } catch (e) {
        if (mounted) setErrorMsg('Camera access denied or unavailable.');
        console.error('Camera error', e);
      }
    }
    start();
    return () => { mounted = false; if (stream) { stream.getTracks().forEach(t => t.stop()); } };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (onCapture) onCapture(blob);
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="space-y-2">
      <div className="w-full bg-[var(--card-bg)] bank-card p-2">
        {errorMsg ? (
          <div className="w-full h-56 flex items-center justify-center text-red-400 text-sm">{errorMsg}</div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-56 object-cover rounded" />
        )}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={handleCapture} className="btn-primary">Capture Photo</button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
