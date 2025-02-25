import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Konfigurasi max file size (100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = {
  // Images
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  // Documents
  "application/pdf": ".pdf",
  // Archives
  "application/zip": ".zip",
  "application/x-zip-compressed": ".zip",
  // Videos
  "video/mp4": ".mp4",
  "video/quicktime": ".mov",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file");

    if (!files || files.length === 0) {
      console.log(files);
      return NextResponse.json({ error: "No files received" }, { status: 400 });
    }

    // Validate files
    for (const file of files) {
      const fileObj = file as File;

      // Check file size
      if (fileObj.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${fileObj.name} exceeds maximum size limit of 100MB` },
          { status: 400 },
        );
      }

      // Check file type
      if (!Object.keys(ALLOWED_FILE_TYPES).includes(fileObj.type)) {
        return NextResponse.json(
          { error: `File type ${fileObj.type} is not supported` },
          { status: 400 },
        );
      }
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    // Process all files
    const uploadResults = await Promise.all(
      files.map(async (file: any) => {
        const fileExt =
          ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES];
        const uniqueFileName = `${uuidv4()}${fileExt}`;
        const filePath = path.join(uploadDir, uniqueFileName);

        // Save file
        const data = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(data));

        return {
          originalName: file.name,
          fileName: uniqueFileName,
          fileUrl: `/uploads/${uniqueFileName}`,
          fileType: file.type,
          fileSize: file.size,
        };
      }),
    );

    return NextResponse.json({
      message: "Files uploaded successfully",
      files: uploadResults,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading files" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Upload API is working" },
    { status: 200 },
  );
}
