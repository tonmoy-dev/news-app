import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

// export const dynamic = 'force-static';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // check if there is searchParams or not
  if (!searchParams.has("page")) {
    try {
      const connection = await connectToDatabase();
      const [rows] = await connection.execute('SELECT * FROM site_meta_info');
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
      const [rows] = await connection.execute(`SELECT * FROM site_meta_info WHERE page_name = '${data}'`);
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
    // 

    // Extract the keys and values from the data object
    const keys = Object.keys(data);
    const values = Object.values(data);

    // Build the query dynamically
    const columns = keys.join(', ');
    const placeholders = keys.map(() => '?').join(', ');

    const query = `
      INSERT INTO site_meta_info (${columns}) 
      VALUES (${placeholders});
    `;

    // 

    // Insert the sanitized data into the site_meta_info table
    const [result] = await connection.execute(query, values);
    // 

    await connection.end(); // Close the connection   

    return new NextResponse(JSON.stringify({ message: 'Pages meta info added successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error inserting data:', error);
    return new NextResponse(JSON.stringify({ message: 'Error inserting data' }), { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { page_name, data } = await request.json(); // Parse the request body

    // If no fields are provided, return an error
    if (Object.keys(data).length === 0) {
      return new NextResponse(JSON.stringify({ message: 'No fields provided to update' }), { status: 400 });
    }

    // Build the SET clause and values array dynamically
    const setClause = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      setClause.push(`${key} = ?`);
      values.push(value);
    }

    // Add the ID to the end of the values array
    values.push(page_name);

    // Prepare the final SQL query
    const query = `
      UPDATE site_meta_info
      SET ${setClause.join(', ')}
      WHERE page_name = ?`;

    // Connect to the database
    const connection = await connectToDatabase();

    // Execute the query with dynamic values
    const [result] = await connection.execute(query, values);

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
