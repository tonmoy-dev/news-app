import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

// export const dynamic = 'force-static';

export async function GET(request) {
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT * FROM site_settings');
        await connection.end(); // Close the connection        
        return new NextResponse(JSON.stringify(rows), { status: 200 });
    } catch (error) {
        console.error('Error fetching data:', error);
        return new NextResponse(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
    }
    return new NextResponse(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
}

export async function PATCH(request) {
    try {
        // Parse the request body to get the dynamic fields directly
        const data = await request.json(); // Now data should be the object with fields

        // Check if there are any fields to update
        if (Object.keys(data).length === 0) {
            return new NextResponse(JSON.stringify({ message: 'No fields to update' }), { status: 400 });
        }

        const connection = await connectToDatabase();

        // Dynamically build the SET clause of the SQL query based on provided fields
        const setClause = Object.keys(data)
            .map(field => `${field} = ?`)
            .join(', ');

        // Get the values of the fields in the correct order for the query
        const values = Object.values(data);

        // Construct the dynamic query to update the only row in site_settings
        const query = `UPDATE site_settings SET ${setClause} LIMIT 1`;

        // Execute the query
        const [result] = await connection.execute(query, values);
        await connection.end(); // Close the connection

        if (result.affectedRows === 0) {
            return new NextResponse(JSON.stringify({ message: 'No settings were updated' }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ message: 'Settings updated successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error updating site settings:', error);
        return new NextResponse(JSON.stringify({ message: 'Error updating settings' }), { status: 500 });
    }
}
