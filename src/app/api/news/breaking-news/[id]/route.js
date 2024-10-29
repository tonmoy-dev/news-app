import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
// export const dynamic = 'force-static'

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

export async function PATCH(request, { params }) {
    const { id } = params;
    const { status, start_time, end_time } = await request.json();



    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute(
            `
            UPDATE breaking_news
            SET status = ?,
                start_time = ?,
                end_time = ?
            WHERE id = ?;
            `,
            [status, start_time, end_time, id]
        );
        await connection.end(); // Close the connection

        if (result.affectedRows === 0) {
            return new NextResponse(JSON.stringify({ message: 'News not found or no changes made' }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ message: 'News updated successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error updating data:', error);
        return new NextResponse(JSON.stringify({ message: 'Error updating data' }), { status: 500 });
    }
}



export async function DELETE(request, { params }) {
    const { id } = params;

    try {
        const connection = await connectToDatabase();
        const [result] = await connection.execute('DELETE FROM breaking_news WHERE id = ?', [id]);

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