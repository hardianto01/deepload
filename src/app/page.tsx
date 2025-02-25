"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface UploadedFile {
  originalName: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const processFiles = async () => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Upload success:", data);

      // Simpan data file yang terupload
      setUploadedFiles(data.files);
      // Tampilkan popup
      setShowPopup(true);
      // Clear files
      setFiles([]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading files. Please try again.");
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [".pdf"],
      "video/*": [".mp4", ".mov"],
      "application/zip": [".zip"],
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="py-6 px-8 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              DeepLoad
            </div>
            <span className="px-2 py-1 text-xs bg-blue-600 rounded-full">
              Beta
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Docs
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Pricing
            </a>
          </nav>
        </div>
      </header>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Upload Successful!</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-4 rounded-lg space-y-2"
                >
                  <p className="font-medium">{file.originalName}</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={`${window.location.origin}${file.fileUrl}`}
                      readOnly
                      className="bg-gray-600 text-sm p-2 rounded flex-1"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}${file.fileUrl}`,
                        );
                        alert("Link copied to clipboard!");
                      }}
                      className="p-2 bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Upload and Process Your Files
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Secure, fast, and reliable file processing platform
          </p>
        </div>

        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={`
            p-12 border-2 border-dashed rounded-xl text-center cursor-pointer
            transition-all transform hover:scale-[1.02]
            ${
              isDragActive
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-600 hover:border-blue-500"
            }
          `}
        >
          <input {...getInputProps()} />

          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-blue-500/20 rounded-full">
                <svg
                  className="w-12 h-12 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-xl font-semibold">
                {isDragActive
                  ? "Drop your files here"
                  : "Drag & drop your files here"}
              </p>
              <p className="text-gray-400 mt-2">
                or click to browse from your computer
              </p>
            </div>
            <div className="text-sm text-gray-400">
              Supports images, PDFs, and videos up to 50MB
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6">Upload Queue</h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-700 rounded-lg">
                      {/* Icon sesuai tipe file */}
                      {file.type.startsWith("image/") && (
                        <svg
                          className="w-6 h-6 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                      {file.type === "application/pdf" && (
                        <svg
                          className="w-6 h-6 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                      {file.type.includes("zip") && (
                        <svg
                          className="w-6 h-6 text-yellow-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                          />
                        </svg>
                      )}
                      {file.type.startsWith("video/") && (
                        <svg
                          className="w-6 h-6 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFiles(files.filter((_, i) => i !== index));
                    }}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 hover:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <button
              onClick={processFiles}
              className="mt-8 w-full bg-gradient-to-r from-blue-500 to-purple-600
                text-white py-4 px-6 rounded-lg font-semibold
                hover:opacity-90 transition-all transform hover:scale-[1.02]
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Process {files.length} file{files.length > 1 ? "s" : ""}
            </button>
          </div>
        )}

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Secure Upload",
              description: "End-to-end encryption for your files",
              icon: "🔒",
            },
            {
              title: "Fast Processing",
              description: "Advanced algorithms for quick results",
              icon: "⚡",
            },
            {
              title: "Multiple Formats",
              description: "Support for various file types",
              icon: "📁",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800 rounded-xl border border-gray-700"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2024 DeepLoad. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
export async function GET() {
  return Response.json({
    name: "DeepLoad API",
    version: "1.0.0",
    status: "active",
    supportedFormats: {
      images: [".jpeg", ".jpg", ".png"],
      documents: [".pdf"],
      videos: [".mp4", ".mov"],
    },
  });
}
