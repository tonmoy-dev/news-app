import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

// export const dynamic = 'force-static'

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
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'No id provided' }, { status: 400 });
    }
    const connection = await connectToDatabase();

    // Delete the record from the 'inbox' table based on 'id'
    const [result] = await connection.execute('DELETE FROM inbox WHERE id = ?', [id]);

    await connection.end(); // Close the connection
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