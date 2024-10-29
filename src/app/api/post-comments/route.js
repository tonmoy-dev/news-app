import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

// export const dynamic = 'force-static'

export async function GET(request) {

  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(`
      SELECT nc.*, n.title
      FROM news_comments AS nc
      JOIN news AS n ON nc.news_post_id = n.id
      `);
    await connection.end(); // Close the connection        

    return new NextResponse(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new NextResponse(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
  }
  return new NextResponse(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
}

export async function POST(request) {

  try {
    const connection = await connectToDatabase();
    const data = await request.json(); // Parse the request body

    // Assuming the data object contains fields matching the news table
    const { user_name, user_email, comment_message, comment_reply, news_post_id, news_post_link, submitted_date_time, status } = data;

    const query = `
            INSERT INTO news_comments (user_name, user_email, comment_message, comment_reply, news_post_id, news_post_link, submitted_date_time, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ? )
        `;

    await connection.execute(query, [user_name, user_email, comment_message, comment_reply, news_post_id, news_post_link, submitted_date_time, status]);
    await connection.end(); // Close the connection      

    // revalidateTag(tag)
    return new NextResponse(JSON.stringify({ message: 'News comment added successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error inserting data:', error);
    return new NextResponse(JSON.stringify({ message: 'Error inserting data' }), { status: 500 });
  }
}


