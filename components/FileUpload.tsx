"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, CheckCircle, Loader2, Music, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  type: "photo" | "music";
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

const ACCEPT = {
  photo: "image/jpeg,image/png,image/webp,image/gif",
  music: "audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/x-m4a,.mp3,.wav,.ogg,.m4a",
};

const MAX_SIZE = { photo: 0.3, music: 1 }; // MB
const LABELS  = { photo: "couple photo", music: "background music" };
const EXTS    = { photo: "JPG, PNG, WebP", music: "MP3, WAV, OGG, M4A" };

// Auto compress image before upload
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 800;

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.7 // quality
      );
    };

    reader.readAsDataURL(file);
  });
}

async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = document.createElement("audio");
    audio.src = URL.createObjectURL(file);

    audio.onloadedmetadata = () => {
  URL.revokeObjectURL(audio.src);
  resolve(audio.duration);
};
  });
}

export default function FileUpload({
  type,
  value,
  onChange,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(value || "");

  const handleFile = useCallback(async (file: File) => {
    setError("");

    let finalFile = file;

    if (type === "music") {
  const duration = await getAudioDuration(file);

  if (duration > 30) {
    setError("Music must be under 30 seconds");
    return;
  }
}

    // Compress image BEFORE checking size
    if (type === "photo") {
      finalFile = await compressImage(file);
    }

    const maxMB = MAX_SIZE[type];
    if (finalFile.size > maxMB * 1024 * 1024) {
      setError(
        type === "photo"
          ? "Image must be under 300KB"
          : "Music must be under 1MB"
      );
      return;
    }

    setUploading(true);

    if (type === "photo") {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(finalFile);
    }

    try {
      const fd = new FormData();
      fd.append("file", finalFile);
      fd.append("type", type);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setPreview(data.url);
      onChange(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
      if (type === "photo") setPreview(value || "");
    } finally {
      setUploading(false);
    }
  }, [type, value, onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [disabled, handleFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const clear = () => {
    setPreview("");
    onChange("");
    setError("");
  };

  const isDone = !!preview && !uploading;
  const isPhoto = type === "photo";

  return (
    <div className="space-y-2">

      {/* Photo Preview */}
      {isPhoto && isDone && (
        <div className="relative w-24 h-24 rounded-xl overflow-hidden border group">
          <img src={preview} alt="Couple" className="w-full h-full object-cover" />
          {!disabled && (
            <button onClick={clear} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
              <X size={16} className="text-white" />
            </button>
          )}
        </div>
      )}

      {/* Music UI */}
      {!isPhoto && isDone && (
        <div className="flex items-center gap-3 bg-emerald-50 border rounded-xl px-4 py-3">
          <CheckCircle size={16} className="text-emerald-600" />
          <div className="flex-1">
            <p className="text-sm font-medium">Music uploaded</p>
            <p className="text-xs truncate">{preview.split("/").pop()}</p>
          </div>
          {!disabled && <button onClick={clear}><X size={14} /></button>}
        </div>
      )}

      {/* Drop zone */}
      {(!isDone || uploading) && (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin mx-auto" />
              <p>Uploading...</p>
            </>
          ) : (
            <>
              <p className="font-medium">
                {dragging ? "Drop to upload" : `Upload ${LABELS[type]}`}
              </p>
              <p className="text-xs text-gray-400">
               {type === "photo" ? "Max 300KB" : "Max 30 sec · 1MB"}
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[type]}
        className="hidden"
        onChange={onInputChange}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}