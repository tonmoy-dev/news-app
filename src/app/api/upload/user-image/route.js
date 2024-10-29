import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from "path";

export async function POST(request) {
  const data = await request.formData();

  const fileName = data.get('fileName');
  const file = data.get('file');

  // Check if imageData (the file) exists
  if (!file) {
    return NextResponse.json({ success: false, message: "No file uploaded" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = fileName.replaceAll(" ", "_");


  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  try {
    await writeFile(
      path.join(process.cwd(), "public/assets/images/" + filename),
      buffer
    );
    return NextResponse.json({ Message: "Success", status: 201, filename });
  } catch (error) {

    return NextResponse.json({ Message: "Failed", status: 500 });
  }

  // const path = `/tmp/${file.name}`
  // await writeFile(path, buffer)
  // 

  // return NextResponse.json({ success: true })
}