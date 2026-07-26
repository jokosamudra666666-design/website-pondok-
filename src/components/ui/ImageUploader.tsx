import React, { useState, useRef } from "react";
import { Upload, Link as LinkIcon, X, Check, Image as ImageIcon, Loader2, RefreshCw } from "lucide-react";
import { apiService } from "../../services/api";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helpText?: string;
  placeholder?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "banner" | "auto";
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label,
  helpText,
  placeholder = "https://...",
  className = "",
  aspectRatio = "auto",
}) => {
  const [activeMode, setActiveMode] = useState<"file" | "url">("file");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      setErrorMessage("File yang dipilih harus berupa gambar (PNG, JPG, WEBP, GIF, SVG).");
      return;
    }

    // Validate size (< 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar terlalu besar (Maksimal 15MB).");
      return;
    }

    setErrorMessage("");
    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target?.result as string;
        try {
          const res = await apiService.uploadImage({
            fileData,
            fileName: file.name,
          });

          if (res.success && res.url) {
            onChange(res.url);
          } else {
            setErrorMessage(res.message || "Gagal mengunggah gambar");
          }
        } catch (err: any) {
          setErrorMessage(err.message || "Gagal menghubungi server upload");
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        setErrorMessage("Gagal membaca file dari komputer.");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses gambar.");
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput("");
    setErrorMessage("");
  };

  const aspectClasses = {
    square: "aspect-square max-w-[180px]",
    video: "aspect-video w-full max-h-[220px]",
    banner: "aspect-[21/9] w-full max-h-[220px]",
    auto: "max-h-[220px] w-full",
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 tracking-wide uppercase">
          {label}
        </label>
      )}

      {/* Main Image Container / Preview */}
      {value ? (
        <div className="relative group rounded-xl border border-gray-200 bg-gray-50 overflow-hidden shadow-sm transition-all duration-200 hover:border-emerald-500">
          <div className={`relative flex items-center justify-center bg-gray-900/5 ${aspectClasses[aspectRatio]}`}>
            <img
              src={value}
              alt="Preview"
              className="max-h-[220px] w-full object-contain p-2 rounded-lg"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Image broken fallback
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400";
              }}
            />
          </div>

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 p-4 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-white/90 hover:bg-white text-gray-800 text-xs font-medium rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Ganti File
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveMode("file")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeMode === "file"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload dari Komputer
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("url")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeMode === "url"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              Gunakan Link URL
            </button>
          </div>

          {/* Mode A: Drag & Drop / Computer File Upload */}
          {activeMode === "file" && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50/50 scale-[1.01]"
                  : "border-gray-300 hover:border-emerald-500 hover:bg-gray-50/80 bg-gray-50/40"
              }`}
            >
              {isUploading ? (
                <div className="py-4 flex flex-col items-center gap-2 text-emerald-700">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-semibold">Mengunggah gambar dari komputer...</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      Klik untuk pilih gambar dari komputer
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      atau seret & lepas file gambar di sini (PNG, JPG, WEBP, GIF)
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mode B: Direct URL Input */}
          {activeMode === "url" && (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyUrl();
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                disabled={!urlInput.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1 transition-colors"
              >
                <Check className="w-4 h-4" />
                Gunakan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* Error Message */}
      {errorMessage && (
        <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
          <X className="w-3.5 h-3.5 shrink-0" />
          {errorMessage}
        </p>
      )}

      {/* Help text */}
      {helpText && !errorMessage && (
        <p className="text-[11px] text-gray-500 mt-1">{helpText}</p>
      )}
    </div>
  );
};
