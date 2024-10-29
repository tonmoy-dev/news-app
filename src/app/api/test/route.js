import Joi from 'joi';
import { NextRequest, NextResponse } from "next/server";
import { authConfig } from '@/utils/auth.config';
import NextAuth from "next-auth";
import { fetchData, parseFilterParams, parseSortParams, parseSearchParams, performDataOperation } from '@/utils/apiHelpers';
import { createUserSchema, patchUserSchema, updateUserSchema } from '@/utils/validation-schema/userSchema';

const { auth } = NextAuth(authConfig);

const table = 'users';

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
  const { error } = createUserSchema.validate(data);

  if (error) {
    return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 });
  }

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

  const { error: dataError } = updateUserSchema.validate({ id, ...data });
  if (dataError) {
    return new Response(JSON.stringify({ error: dataError.details[0].message }), { status: 400 });
  }

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

  const { error: dataError } = patchUserSchema.validate({ id, ...data });
  if (dataError) {
    return new Response(JSON.stringify({ error: dataError.details[0].message }), { status: 400 });
  }

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


/*
Example API Request URLs for id, filter, sort, search, dateRange, page, limit, otherParams
http://localhost:3000/api/test?id=1

http://localhost:3000/api/test?filter[name]=John
http://localhost:3000/api/test?filter[status]=active&filter[role]=admin

http://localhost:3000/api/test?sort[name]=asc
http://localhost:3000/api/test?sort[name]=asc&sort[created_at]=desc

http://localhost:3000/api/test?search[name]=John
http://localhost:3000/api/test?search[name]=John&search[email]=john@example.com

http://localhost:3000/api/test?startDate=2023-01-01&endDate=2023-12-31

http://localhost:3000/api/test?page=1&limit=10
http://localhost:3000/api/test?page=2&limit=10
http://localhost:3000/api/test?page=3&limit=10

http://localhost:3000/api/test?filter[status]=active&sort[lastName]=desc&page=2&limit=5
*/


// Example: POST /api/news with body { "data": { "title": "New Article", "content": "Content goes here." } }
// Example: PUT /api/news with body { "id": 1, "data": { "title": "Updated Article", "content": "Updated content." } }
// Example: PATCH /api/news with body { "id": 1, "data": { "title": "Partially Updated Article" } }
// Example: DELETE /api/news?id=1

