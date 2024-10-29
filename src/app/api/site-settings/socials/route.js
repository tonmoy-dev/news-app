import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

// export const dynamic = 'force-static';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // check if there is searchParams or not
  if (!searchParams.has('status')) {
    try {
      const connection = await connectToDatabase();
      const [rows] = await connection.execute('SELECT * FROM site_socials');
      await connection.end(); // Close the connection        
      return new NextResponse(JSON.stringify(rows), { status: 200 });
    } catch (error) {
      console.error('Error fetching data:', error);
      return new NextResponse(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
    }
    return new NextResponse(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
  } else {
    const status = searchParams.get('status');
    try {
      const connection = await connectToDatabase();
      const [rows] = await connection.execute('SELECT * FROM site_socials WHERE status = 1');
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
    const { name, link, status, counts } = data;

    // Insert the sanitized data into the inbox table
    const query = `INSERT INTO site_socials (name, link, status, counts) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [name, link, status, counts]);


    await connection.end(); // Close the connection   

    // revalidateTag(tag)
    return new NextResponse(JSON.stringify({ message: 'New mail added successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error inserting data:', error);
    return new NextResponse(JSON.stringify({ message: 'Error inserting data' }), { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // Get data from the request body
    const { id, name, link, status, counts } = await request.json();

    const connection = await connectToDatabase();



    // Update the socials record based on the ID
    const [result] = await connection.execute(
      'UPDATE site_socials SET name = ?, link = ?, status = ?, counts = ? WHERE id = ?',
      [name, link, status, counts, id]
    );

    await connection.end(); // Close the connection

    // If no rows were affected, return a 404 response
    if (result.affectedRows === 0) {
      return new NextResponse(JSON.stringify({ message: 'Social not found' }), { status: 404 });
    }

    // Return a success message if the update was successful
    return new NextResponse(JSON.stringify({ message: 'Social updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating social:', error);
    return new NextResponse(JSON.stringify({ message: 'Error updating social' }), { status: 500 });
  }
}



export async function PATCH(request) {
  try {
    const { id, value } = await request.json();

    const connection = await connectToDatabase();

    // Update the Socials status based on the ID
    const [result] = await connection.execute(
      'UPDATE site_socials SET status = ? WHERE id = ?',
      [value, id]
    );

    await connection.end(); // Close the connection

    if (result.affectedRows === 0) {
      return new NextResponse(JSON.stringify({ message: 'Socials not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: 'Status updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error);
    return new NextResponse(JSON.stringify({ message: 'Error updating status' }), { status: 500 });
  }
}
