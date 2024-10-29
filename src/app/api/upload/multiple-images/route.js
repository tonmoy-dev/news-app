import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  const data = await request.formData();

  // Prepare an array to store the filenames and fieldNames for response
  const uploadedFiles = [];

  // Iterate through form data to get all images (fieldName, file, fileName)
  for (const entry of data.entries()) {
    const [fieldName, file] = entry;

    // Each file data might contain the following: fieldName, file object, and fileName
    if (file instanceof Blob) { // Check if the value is a file
      const fileName = data.get(`${fieldName}_fileName`); // Assuming fileName is passed with `${fieldName}_fileName`

      // Ensure file exists
      if (!file) {
        return NextResponse.json({ success: false, message: `No file uploaded for ${fieldName}` });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const newFileName = fileName.replaceAll(" ", "_");
      const filePath = path.join(process.cwd(), "public/assets/images/" + newFileName);

      try {
        // Save the file to the filesystem
        await writeFile(filePath, buffer);

        // Push the uploaded file details into the result array
        uploadedFiles.push({ fieldName, fileName: newFileName });
      } catch (error) {

        return NextResponse.json({ success: false, message: `Failed to upload ${fieldName}` });
      }
    }
  }

  // If successful, return the uploaded filenames and their corresponding fieldNames
  return NextResponse.json({
    message: "Success",
    status: 201,
    uploadedFiles, // Array of uploaded fieldName and new filenames
  });
}
