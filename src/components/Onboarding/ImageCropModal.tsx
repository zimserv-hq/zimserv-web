// src/components/Onboarding/ImageCropModal.tsx
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { X, ZoomIn, ZoomOut, CropIcon } from "lucide-react";

interface ImageCropModalProps {
  imageSrc: string;
  onConfirm: (croppedFile: File, previewUrl: string) => void;
  onCancel: () => void;
  originalFileName: string;
}

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  fileName: string,
): Promise<{ file: File; previewUrl: string }> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
        const mime = ext === "png" ? "image/png" : "image/jpeg";
        const croppedFile = new File([blob], `cropped_${fileName}`, {
          type: mime,
        });
        const previewUrl = URL.createObjectURL(blob);
        resolve({ file: croppedFile, previewUrl });
      },
      "image/jpeg",
      0.92,
    );
  });
};

const ImageCropModal = ({
  imageSrc,
  onConfirm,
  onCancel,
  originalFileName,
}: ImageCropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const { file, previewUrl } = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        originalFileName,
      );
      onConfirm(file, previewUrl);
    } catch (err) {
      console.error("Crop failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <style>{`
        .crop-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.75);
          display: flex; align-items: center; justify-content: center;
          z-index: 2000; padding: 20px; backdrop-filter: blur(4px);
          animation: cropFadeIn 0.2s ease;
        }
        @keyframes cropFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .crop-modal {
          background: var(--color-bg); border-radius: var(--radius-lg);
          width: 100%; max-width: 520px;
          box-shadow: var(--shadow-xl); overflow: hidden;
          animation: cropSlideUp 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes cropSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .crop-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px 14px; border-bottom: 1.5px solid var(--color-border);
        }
        .crop-header-left { display: flex; align-items: center; gap: 10px; }
        .crop-header-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--color-accent-soft); display: flex;
          align-items: center; justify-content: center; color: var(--color-accent);
          flex-shrink: 0;
        }
        .crop-title { font-size: 16px; font-weight: 800; color: var(--color-primary); }
        .crop-subtitle { font-size: 12px; color: var(--color-text-secondary); margin-top: 1px; }
        .crop-close-btn {
          background: transparent; border: none; cursor: pointer;
          color: var(--color-text-secondary); padding: 4px;
          border-radius: var(--radius-sm); display: flex;
          transition: color 0.2s, background 0.2s;
        }
        .crop-close-btn:hover { color: var(--color-primary); background: var(--color-bg-section); }

        /* ── NB Guideline banner ── */
        .crop-guideline {
          margin: 14px 16px 0;
          padding: 10px 14px;
          background: rgba(255,107,53,0.06);
          border: 1.5px solid rgba(255,107,53,0.2);
          border-radius: 10px;
          font-size: 13px;
          color: var(--color-text-secondary);
          line-height: 1.6;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .crop-guideline-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
        .crop-guideline strong { color: var(--color-primary); }

        .crop-canvas-wrap {
          position: relative; width: 100%; height: 320px;
          background: #111; margin-top: 14px;
        }
        .crop-zoom-row {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 20px 0;
        }
        .crop-zoom-icon { color: var(--color-text-secondary); flex-shrink: 0; }
        .crop-zoom-slider {
          flex: 1; -webkit-appearance: none; appearance: none;
          height: 4px; border-radius: 4px;
          background: linear-gradient(
            to right,
            var(--color-accent) 0%,
            var(--color-accent) calc((var(--zoom-pct, 0)) * 1%),
            var(--color-border) calc((var(--zoom-pct, 0)) * 1%),
            var(--color-border) 100%
          );
          outline: none; cursor: pointer;
        }
        .crop-zoom-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--color-accent); cursor: pointer;
          border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .crop-zoom-label {
          font-size: 12px; font-weight: 600; color: var(--color-text-secondary);
          min-width: 36px; text-align: right;
        }
        .crop-actions {
          display: flex; gap: 10px; justify-content: flex-end;
          padding: 16px 20px 20px;
        }
        .crop-btn {
          padding: 10px 22px; border-radius: var(--radius-full);
          font-family: var(--font-primary); font-size: 14px; font-weight: 700;
          cursor: pointer; border: none; transition: all 0.2s ease;
        }
        .crop-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .crop-btn-cancel {
          background: var(--color-bg-section); color: var(--color-text-secondary);
          border: 1.5px solid var(--color-border);
        }
        .crop-btn-cancel:hover:not(:disabled) {
          border-color: var(--color-accent); color: var(--color-accent);
        }
        .crop-btn-confirm {
          background: var(--color-accent); color: #fff;
          box-shadow: 0 3px 12px rgba(236,111,22,0.3);
        }
        .crop-btn-confirm:hover:not(:disabled) {
          background: var(--color-accent-hover);
          box-shadow: 0 5px 16px rgba(236,111,22,0.4);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="crop-overlay" onClick={onCancel}>
        <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="crop-header">
            <div className="crop-header-left">
              <div className="crop-header-icon">
                <CropIcon size={18} strokeWidth={2.5} />
              </div>
              <div>
                <div className="crop-title">Crop Your Profile Photo</div>
                <div className="crop-subtitle">
                  Drag to reposition · Scroll or use slider to zoom
                </div>
              </div>
            </div>
            <button
              className="crop-close-btn"
              onClick={onCancel}
              aria-label="Close"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* NB Guideline */}
          <div className="crop-guideline">
            <span className="crop-guideline-icon">📸</span>
            <span>
              <strong>Tip:</strong> Choose a photo that best represents your
              work — a clear{" "}
              <strong>
                headshot, business logo, or a quality photo of your completed
                work
              </strong>{" "}
              all work great. Avoid blurry images, screenshots, or business
              cards. A strong photo builds trust and gets you more enquiries.
            </span>
          </div>

          {/* Crop canvas */}
          <div className="crop-canvas-wrap">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={true}
              style={{
                containerStyle: { borderRadius: 0 },
                cropAreaStyle: {
                  border: "2.5px solid rgba(236,111,22,0.9)",
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                },
              }}
            />
          </div>

          {/* Zoom slider */}
          <div className="crop-zoom-row">
            <ZoomOut size={16} strokeWidth={2} className="crop-zoom-icon" />
            <input
              type="range"
              className="crop-zoom-slider"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              style={
                { "--zoom-pct": ((zoom - 1) / 2) * 100 } as React.CSSProperties
              }
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <ZoomIn size={16} strokeWidth={2} className="crop-zoom-icon" />
            <span className="crop-zoom-label">{zoom.toFixed(1)}×</span>
          </div>

          {/* Actions */}
          <div className="crop-actions">
            <button
              className="crop-btn crop-btn-cancel"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              className="crop-btn crop-btn-confirm"
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing…" : "Use This Photo"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageCropModal;
