import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from "path";

export async function POST(request) {
    const data = await request.formData()
    const file = data.get('file')

    if (!file) {
        return NextResponse.json({ success: false })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = file.name.replaceAll(" ", "_");


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


/*
Add post -> Thumbnail image -> total 4 images

site settings -> header, footer, favicon, watermark, site loader, ads banner -> total 6 images

account settings -> profile image -> total 1 image

*/