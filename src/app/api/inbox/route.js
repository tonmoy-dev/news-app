import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

// export const dynamic = 'force-static'

export async function GET(request) {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM inbox ORDER BY created_at DESC');
    await connection.end(); // Close the connection

    if (rows.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'Messages not found' }), { status: 404 });
    }
    return new NextResponse(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new NextResponse(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
  }
}

export async function POST(request) {

  try {
    const connection = await connectToDatabase();
    const data = await request.json(); // Parse the request body

    // Assuming the data object contains fields matching the news table
    const { mailDate, name, email, message, isRead, phone, subject } = data;

    // Insert the sanitized data into the inbox table
    const query = `INSERT INTO inbox (mailDate, name, email, message, isRead, phone, subject) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [mailDate, name, email, message, isRead, phone, subject]);


    await connection.end(); // Close the connection   

    // revalidateTag(tag)
    return new NextResponse(JSON.stringify({ message: 'New mail added successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error inserting data:', error);
    return new NextResponse(JSON.stringify({ message: 'Error inserting data' }), { status: 500 });
  }
}


export async function PATCH(request) {
  try {
    const { id, value } = await request.json();

    const connection = await connectToDatabase();

    // Update the news status based on the ID
    const [result] = await connection.execute(
      'UPDATE inbox SET isRead = ? WHERE id = ?',
      [value, id]
    );

    await connection.end(); // Close the connection

    if (result.affectedRows === 0) {
      revalidateTag('newsByStatus');
      return new NextResponse(JSON.stringify({ message: 'News not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: 'Status updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error);
    return new NextResponse(JSON.stringify({ message: 'Error updating status' }), { status: 500 });
  }
}


// Define the DELETE route
export async function DELETE(request) {
  try {
    // Parse the request body to get the 'id'
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'No id provided' }, { status: 400 });
    }

    // Delete the record from the 'inbox' table based on 'id'
    const [result] = await db.query('DELETE FROM inbox WHERE id = ?', [id]);

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'No message found with this id' }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({ success: true, message: `Message with id ${id} deleted` });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete message' }, { status: 500 });
  }
}