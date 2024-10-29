import { fetchData, parseFilterParams, parseSearchParams, parseSortParams, performDataOperation } from '@/utils/apiHelpers';
import { authConfig } from '@/utils/auth.config';
import Joi from 'joi';
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

const table = 'news';

// GET Handler
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    // If there are no search parameters, fetch all data
    if (![...searchParams].length) {
        try {
            const allResults = await fetchData({ table, fetchAll: true });
            return new Response(JSON.stringify(allResults), { status: 200 });
        } catch (error) {
            console.error("Error fetching all data:", error);
            return new Response(JSON.stringify({ error: "An internal error occurred." }), { status: 500 });
        }
    } else {
        // Parse other query parameters if present
        const id = searchParams.get('id');
        const filters = parseFilterParams(searchParams);
        const sorts = parseSortParams(searchParams);
        const searches = parseSearchParams(searchParams);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const dateRange = { startDate, endDate };


        // Parse and validate pagination parameters
        const page = parseInt(searchParams.get('page')) || 1; // Default to page 1
        const limit = parseInt(searchParams.get('limit')) || 10; // Default limit to 10

        if (page < 1 || limit < 1) {
            return new Response(JSON.stringify({ error: "Page and limit must be positive integers." }), { status: 400 });
        }

        try {
            const results = await fetchData({
                table,
                id,
                filters,
                sorts,
                searches,
                dateRange,
                page,
                limit,
            });
            return new Response(JSON.stringify(results), { status: 200 });
        } catch (error) {
            console.error("Error in GET handler:", error);
            return new Response(JSON.stringify({ error: "An internal error occurred." }), { status: 500 });
        }
    }
}

// POST Handler
export async function POST(request) {
    // const session = await auth();

    // if (!session?.user) {
    //   return new NextResponse(`You are not authenticated!`, {
    //     status: 500,
    //   });
    // }

    const { data } = await request.json();



    // const { error } = createNewsSchema.validate(data);
    // if (error) {
    //     return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 });
    // }

    try {
        const result = await performDataOperation({ table, operation: 'create', data });

        return new Response(JSON.stringify(result), { status: 201 });
    } catch (error) {
        console.error('Error in POST handler:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}

// PUT Handler
export async function PUT(request) {
    // const session = await auth();

    // if (!session?.user) {
    //   return new NextResponse(`You are not authenticated!`, {
    //     status: 500,
    //   });
    // }
    const { id, data } = await request.json();

    const { error: idError } = Joi.number().integer().positive().validate(id);
    if (idError) {
        return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    // const { error: dataError } = updateNewsSchema.validate({ id, ...data });
    // if (dataError) {
    //     return new Response(JSON.stringify({ error: dataError.details[0].message }), { status: 400 });
    // }

    try {
        const result = await performDataOperation({ table, operation: 'update', id, data });
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error('Error in PUT handler:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}

// PATCH Handler
export async function PATCH(request) {
    // const session = await auth();

    // if (!session?.user) {
    //   return new NextResponse(`You are not authenticated!`, {
    //     status: 500,
    //   });
    // }

    const { id, data } = await request.json();
    const { error: idError } = Joi.number().integer().positive().validate(id);

    if (idError) {
        return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    // const { error: dataError } = patchNewsSchema.validate({ id, ...data });
    // if (dataError) {
    //     return new Response(JSON.stringify({ error: dataError.details[0].message }), { status: 400 });
    // }

    try {
        const result = await performDataOperation({ table, operation: 'patch', id, data });
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error('Error in PATCH handler:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}

// DELETE Handler
export async function DELETE(request) {
    // const session = await auth();

    // if (!session?.user) {
    //   return new NextResponse(`You are not authenticated!`, {
    //     status: 500,
    //   });
    // }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');  // Extract 'id' from the query params

    // Validate id
    const { error: idError } = Joi.number().integer().positive().validate(id);
    if (idError) {
        return new Response(JSON.stringify({ error: 'Invalid ID' }), { status: 400 });
    }

    try {
        const result = await performDataOperation({ table, operation: 'delete', id });
        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
}
