import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

// export const dynamic = 'force-static';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // check if there is searchParams or not
  if (!searchParams.has("page")) {
    try {
      const connection = await connectToDatabase();
      const [rows] = await connection.execute('SELECT * FROM pages_meta_info');
      await connection.end(); // Close the connection        

      return new NextResponse(JSON.stringify(rows), { status: 200 });
    } catch (error) {
      console.error('Error fetching data:', error);
      return new NextResponse(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
    }
    return new NextResponse(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
  } else {
    const data = searchParams.get('page');

    try {
      const connection = await connectToDatabase();
      const [rows] = await connection.execute(`SELECT * FROM pages_meta_info WHERE name = '${data}'`);
      await connection.end(); // Close the connection   

      return new NextResponse(JSON.stringify(rows), { status: 200 });
    } catch (error) {
      console.error('Error fetching data:', error);
      return new NextResponse(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
    }
  }
}



export async function POST(request) {
  try {
    const connection = await connectToDatabase();
    const data = await request.json(); // Parse the request body

    // Assuming the data object contains fields matching the news table
    const { meta_description, meta_keywords, meta_title, name } = data;

    // Insert the sanitized data into the inbox table
    const query = `INSERT INTO pages_meta_info (meta_description, meta_keywords, meta_title, name) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [meta_description, meta_keywords, meta_title, name]);

    await connection.end(); // Close the connection   

    return new NextResponse(JSON.stringify({ message: 'Pages meta info added successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error inserting data:', error);
    return new NextResponse(JSON.stringify({ message: 'Error inserting data' }), { status: 500 });
  }
}


export async function PATCH(request) {
  try {

    const data = await request.json(); // Parse the request body to get 'id' and 'status'
    const { meta_description, meta_keywords, meta_title, id } = data;

    const connection = await connectToDatabase();
    const query = `
      UPDATE pages_meta_info
      SET 
        meta_description = "${meta_description}", 
        meta_keywords = "${meta_keywords}", 
        meta_title = "${meta_title}" 
      WHERE id = ${id}
    `;

    // Update the news status based on the ID
    const [result] = await connection.execute(query);

    await connection.end(); // Close the connection

    if (result.affectedRows === 0) {
      return new NextResponse(JSON.stringify({ message: 'Info not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: 'Info updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating data:', error);
    return new NextResponse(JSON.stringify({ message: 'Error on updating data' }), { status: 500 });
  }
}
