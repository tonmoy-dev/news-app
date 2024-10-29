import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

// export const dynamic = 'force-static'

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { name, status, meta_title, meta_keywords, meta_description } = await request.json();

    const connection = await connectToDatabase();

    // Update the news status based on the ID
    const [result] = await connection.execute(
      `UPDATE news_category
        SET name = ?, status = ?, meta_title = ?, meta_keywords = ?, meta_description = ? 
        WHERE id = ?`,
      [name, status, meta_title, meta_keywords, meta_description, id]
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
    const connection = await connectToDatabase();

    // Delete the record from the 'news_category' table based on 'id'
    const [result] = await connection.execute('DELETE FROM news_category WHERE id = ?', [id]);

    await connection.end(); // Close the connection
    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'No Category found with this id' }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({ success: true, message: `Category is deleted` });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}