import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

// READ: Get favorite news (with or without user email)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  try {
    const connection = await connectToDatabase();
    let query = "SELECT * FROM favorite_news";
    const params = [];

    if (email) {
      query += " WHERE user_email = ?";
      params.push(email);
    }

    const [rows] = await connection.execute(query, params);
    await connection.end(); // Close the connection
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
  }
}

// CREATE: Add news to favorites
export async function POST(request) {
  const { user_email, news_id, news_title, news_category } = await request.json();

  if (!user_email || !news_id || !news_title || !news_category) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  try {
    const connection = await connectToDatabase();
    // Check if the news is already in the table
    const [existingRows] = await connection.execute(
      "SELECT * FROM favorite_news WHERE user_email = ? AND news_id = ?",
      [user_email, news_id]
    );

    if (existingRows.length > 0) {
      await connection.end();

      return NextResponse.json({ message: "News already in favorites" });
    }

    // Insert the new favorite news entry
    await connection.execute(
      "INSERT INTO favorite_news (user_email, news_id, news_title, news_category) VALUES (?, ?, ?, ?)",
      [user_email, news_id, news_title, news_category]
    );
    await connection.end(); // Close the connection
    return NextResponse.json({ message: "News added to favorites" }, { status: 201 });
  } catch (error) {
    console.error("Error adding news to favorites:", error);
    return NextResponse.json({ message: "Error adding news to favorites" }, { status: 500 });
  }
}

// DELETE: Remove news from favorites
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const id = searchParams.get("id");

  if (!email || !id) {
    return NextResponse.json({ message: "Email and news_id are required" }, { status: 400 });
  }

  try {
    const connection = await connectToDatabase();
    // Delete the favorite news entry
    const [result] = await connection.execute(
      "DELETE FROM favorite_news WHERE user_email = ? AND id = ?",
      [email, id]
    );
    await connection.end(); // Close the connection

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Favorite news not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Favorite news removed from favorites" }, { status: 200 });
  } catch (error) {
    console.error("Error removing news from favorites:", error);
    return NextResponse.json({ message: "Error removing news from favorites" }, { status: 500 });
  }
}
