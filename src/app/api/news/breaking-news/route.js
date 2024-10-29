import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { redirect } from 'next/navigation'

// export const dynamic = 'force-static'

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    if (searchParams.has("email")) {
        const email = searchParams.get("email");
        try {
            const connection = await connectToDatabase();
            const [rows] = await connection.execute(`SELECT * FROM breaking_news WHERE reporter_email = '${email}'`);
            await connection.end(); // Close the connection

            if (rows.length === 0) {
                return new NextResponse(JSON.stringify({ message: 'News not found' }), { status: 404 });
            }

            return new NextResponse(JSON.stringify(rows), { status: 200 });
        } catch (error) {
            console.error('Error fetching data:', error);
            return new NextResponse(JSON.stringify({ message: 'Error fetching data' }), { status: 500 });
        }
    } else {
        try {
            const connection = await connectToDatabase();
            const [rows] = await connection.execute('SELECT * FROM breaking_news');
            await connection.end(); // Close the connection

            if (rows.length === 0) {
                return new NextResponse(JSON.stringify({ message: 'News not found' }), { status: 404 });
            }

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

        // Assuming the data object contains fields matching the news table
        const { title, status, reporter_email, start_time, end_time } = data;

        const query = `
            INSERT INTO breaking_news (title, status, reporter_email, start_time, end_time)
            VALUES (?, ?, ?, ?, ?)
        `;

        await connection.execute(query, [title, status, reporter_email, start_time, end_time]);
        await connection.end(); // Close the connection      

        // revalidateTag(tag)
        return new NextResponse(JSON.stringify({ message: 'News post added successfully' }), { status: 201 });
    } catch (error) {
        console.error('Error inserting data:', error);
        return new NextResponse(JSON.stringify({ message: 'Error inserting data' }), { status: 500 });
    }
}
