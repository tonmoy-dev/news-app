import { query } from '@/lib/dbConnect';
import mysql from 'mysql2';
import Joi from 'joi';

/**
 * Helper function to parse `filter` query parameters from the URL
 * Expected format: filter[field]=value
 */
export function parseFilterParams(searchParams) {
  const filters = [];
  searchParams.forEach((value, key) => {
    if (key.startsWith('filter[') && key.endsWith(']')) {
      const field = key.slice(7, -1); // Extract field name from 'filter[field]'
      filters.push({ [field]: value });
    }
  });
  return filters;
}

/**
 * Helper function to parse `sort` query parameters from the URL
 * Expected format: sort[field]=asc|desc
 */
export function parseSortParams(searchParams) {
  const sorts = [];
  searchParams.forEach((value, key) => {
    if (key.startsWith('sort[') && key.endsWith(']')) {
      const field = key.slice(5, -1); // Extract field name from 'sort[field]'
      sorts.push({ [field]: value });
    }
  });
  return sorts;
}

/**
 * Helper function to parse `search` query parameters from the URL
 * Expected format: search[field]=value
 */
export function parseSearchParams(searchParams) {
  const searches = [];
  searchParams.forEach((value, key) => {
    if (key.startsWith('search[') && key.endsWith(']')) {
      const field = key.slice(7, -1); // Extract field name from 'search[field]'
      searches.push({ [field]: value });
    }
  });
  return searches;
}

// Fetch data from the database
export const fetchData = async ({ table, id, filters, sorts, searches, dateRange, page, limit, fetchAll = false }) => {
  let sql = `SELECT * FROM ${mysql.escapeId(table)}`; // Base query
  const sqlParams = [];

  // If fetching all data, avoid unnecessary filters and sorts
  if (!fetchAll) {

    // Fetch data by ID if provided
    if (id) {
      sqlParams.push(id);
      sql += ' WHERE id = ?';
      return await query(sql, sqlParams);
    } else {
      sql += ' WHERE 1=1'; // Start WHERE clause for filtering
    }

    // Apply filters
    if (filters && filters.length > 0) {
      filters.forEach(filter => {
        const [field, value] = Object.entries(filter)[0];
        sql += ` AND ${mysql.escapeId(field)} = ?`;
        sqlParams.push(value);
      });
    }

    // Apply search
    if (searches && searches.length > 0) {
      searches.forEach(s => {
        const [field, value] = Object.entries(s)[0];
        sql += ` AND ${mysql.escapeId(field)} LIKE ?`;
        sqlParams.push(`%${value}%`);
      });
    }

    // Apply date range if both dates are provided
    if (dateRange && dateRange.startDate && dateRange.endDate) {
      sql += ' AND date BETWEEN ? AND ?';
      sqlParams.push(dateRange.startDate, dateRange.endDate);
    }

    // Apply sorting
    if (sorts && sorts.length > 0) {
      sorts.forEach(sort => {
        const [field, direction] = Object.entries(sort)[0];
        sql += ` ORDER BY ${mysql.escapeId(field)} ${direction.toUpperCase()}`;
      });
    }

    // Pagination
    if (limit) {
      const offset = (page - 1) * limit; // Calculate the offset for pagination
      sql += ` LIMIT ?, ?`; // Add LIMIT and OFFSET to the query
      sqlParams.push(offset, limit);
    }
  }

  try {
    return await query(sql, sqlParams);
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Internal server error");
  }
};


// Utility function for creating, updating, and deleting records
export const performDataOperation = async ({ table, operation, id, data }) => {
  const allowedTables = ['news', 'reporters', 'settings', 'editors', 'users'];

  // Validate the table
  if (!allowedTables.includes(table)) {
    throw new Error('Invalid table specified');
  }

  let sql = '';
  const sqlParams = [];

  switch (operation) {
    case 'create':
      const fields = Object.keys(data).map(key => mysql.escapeId(key)).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      sql = `INSERT INTO ${mysql.escapeId(table)} (${fields}) VALUES (${placeholders})`;
      sqlParams.push(...Object.values(data));
      break;

    case 'update':
    case 'patch':
      if (!id) throw new Error('ID is required for update operations');
      const updateFields = Object.keys(data).map(key => `${mysql.escapeId(key)} = ?`).join(', ');
      sql = `UPDATE ${mysql.escapeId(table)} SET ${updateFields} WHERE id = ?`;
      sqlParams.push(...Object.values(data), id);
      break;

    case 'delete':
      if (!id) throw new Error('ID is required for delete operations');
      sql = `DELETE FROM ${mysql.escapeId(table)} WHERE id = ?`;
      sqlParams.push(id);
      break;

    default:
      throw new Error('Invalid operation specified');
  }

  try {
    await query(sql, sqlParams);
    return { message: `${operation.charAt(0).toUpperCase() + operation.slice(1)} operation successful` };
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database operation failed');
  }
};

