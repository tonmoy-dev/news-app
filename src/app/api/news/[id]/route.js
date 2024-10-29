import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = params;

    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT * FROM news WHERE id = ?', [id]);
        await connection.end(); // Close the connection

        if (rows.length === 0) {
            return new NextResponse(JSON.stringify({ message: 'News not found' }), { status: 404 });
        }

        return new NextResponse(JSON.stringify(rows[0]), { status: 200 });
    } catch (error) {
        console.error('Error fetching data:', error);
        return new NextResponse(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
    }
}


export async function PUT(request, { params }) {
    const { id } = params;
    const body = await request.json();

    // Check if ID is provided
    if (!id) {
        return new NextResponse(JSON.stringify({ message: 'ID is required' }), { status: 400 });
    }

    // Check if the body contains fields to update
    if (Object.keys(body).length === 0) {
        return new NextResponse(JSON.stringify({ message: 'No fields to update' }), { status: 400 });
    }

    // Dynamically build the update query based on provided fields
    let query = 'UPDATE news SET ';
    const values = [];
    const fieldsToUpdate = [];

    // Loop through the body to get the fields and values
    for (const [key, value] of Object.entries(body)) {
        // Only add fields that have a non-null and non-empty value
        if (value !== undefined && value !== null) {
            fieldsToUpdate.push(`${key} = ?`);
            values.push(value);
        }
    }

    // If no valid fields to update, return an error
    if (fieldsToUpdate.length === 0) {
        return new NextResponse(JSON.stringify({ message: 'No valid fields to update' }), { status: 400 });
    }

    // Finalize the query with the fields and the ID
    query += fieldsToUpdate.join(', ') + ' WHERE id = ?';
    values.push(id);

    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute(query, values);
        await connection.end();

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return new NextResponse(JSON.stringify({ message: 'News item not found' }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ message: 'News item updated successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error updating news item:', error);
        return new NextResponse(JSON.stringify({ message: 'Error updating news item' }), { status: 500 });
    }
}




export async function DELETE(request, { params }) {
    const { id } = params;
    if (!id) {
        return new NextResponse(JSON.stringify({ message: 'ID is required' }), { status: 400 });
    }

    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute('DELETE FROM news WHERE id = ?', [id]);

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