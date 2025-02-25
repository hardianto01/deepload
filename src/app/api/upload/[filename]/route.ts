import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: { filename: string } },
) {
  try {
    const filename = params.filename;
    const filePath = path.join("/tmp", "uploads", filename);
    console.log(filePath);
    // Baca file
    const fileBuffer = await readFile(filePath);

    // Tentukan Content-Type berdasarkan ekstensi file
    const fileExtension = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream"; // default content type

    const contentTypes: { [key: string]: string } = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".pdf": "application/pdf",
      ".zip": "application/zip",
      ".mp4": "video/mp4",
      ".mov": "video/quicktime",
      ".webp": "image/webp",
    };

    if (fileExtension in contentTypes) {
      contentType = contentTypes[fileExtension];
    }

    // Return file dengan header yang sesuai
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error accessing file:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
