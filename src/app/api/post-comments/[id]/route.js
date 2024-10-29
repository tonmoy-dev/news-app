import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(`
        SELECT * FROM news_comments 
        WHERE status = true 
        AND news_post_id = ${id};
        `);

    await connection.end(); // Close the connection   

    return new NextResponse(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new NextResponse(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    let query;
    const { id } = params;
    const data = await request.json(); // Parse the request body to get 'id' and 'status'
    const { fieldName, value } = data;

    const connection = await connectToDatabase();
    if (fieldName === "comment_reply") {
      query = `UPDATE news_comments SET ${fieldName} = "${value}" WHERE id = ${id};`;
    } else {
      query = `UPDATE news_comments SET ${fieldName} = ${value} WHERE id = ${id};`;
    }
    // Update the news status based on the ID
    const [result] = await connection.execute(query);

    await connection.end(); // Close the connection

    if (result.affectedRows === 0) {
      return new NextResponse(JSON.stringify({ message: 'Comment not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: 'Updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating data:', error);
    return new NextResponse(JSON.stringify({ message: 'Error on updating data' }), { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  const { id } = params;
  if (!id) {
    return new NextResponse(JSON.stringify({ message: 'ID is required' }), { status: 400 });
  }

  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute('DELETE FROM news_comments WHERE id = ?', [id]);

    await connection.end(); // Close the connection

    if (result.affectedRows === 0) {
      return new NextResponse(JSON.stringify({ message: 'News item not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: 'News item deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting news item:', error);
    return new NextResponse(JSON.stringify({ message: 'Error deleting news item' }), { status: 500 });
  }
}