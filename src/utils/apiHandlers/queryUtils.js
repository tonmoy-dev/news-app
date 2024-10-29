import { query } from '@/lib/dbConnect';
import mysql from 'mysql2';


export const fetchData = async ({ table, id, filters, sorts, search, dateRange }) => {
  const allowedTables = ['news', 'reporters', 'settings', 'editors', 'users'];

  // Validate the table
  if (!allowedTables.includes(table)) {
    throw new Error('Invalid table specified');
  }

  let sql = `SELECT * FROM ${mysql.escapeId(table)} WHERE 1=1`;
  const sqlParams = [];

  // Handle single resource retrieval
  if (id) {
    sql += ' AND id = ?';
    sqlParams.push(id);
  }

  // Handle filtering
  if (filters) {
    filters.forEach(filter => {
      const [field, value] = filter.split(':');
      sql += ` AND ${mysql.escapeId(field)} = ?`;
      sqlParams.push(value);
    });
  }

  // Handle search
  if (search) {
    sql += ' AND (title LIKE ? OR content LIKE ?)';
    sqlParams.push(`%${search}%`, `%${search}%`);
  }

  // Handle date range search
  if (dateRange && dateRange.startDate && dateRange.endDate) {
    sql += ' AND date BETWEEN ? AND ?';
    sqlParams.push(dateRange.startDate, dateRange.endDate);
  }

  // Handle sorting
  if (sorts) {
    sorts.forEach(sort => {
      const [field, direction] = sort.split(':');
      sql += ` ORDER BY ${mysql.escapeId(field)} ${direction.toUpperCase()}`;
    });
  }

  try {
    return await query(sql, sqlParams);
  } catch (error) {
    console.error('Database query error:', error);

    // Differentiate between error types and handle accordingly
    if (error.code === 'ER_BAD_DB_ERROR') {
      return new Response(JSON.stringify({ error: 'Database not found' }), { status: 500 });
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
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
      if (!id) throw new Error('ID is required for update operations');
      const updateFields = Object.keys(data).map(key => `${mysql.escapeId(key)} = ?`).join(', ');
      sql = `UPDATE ${mysql.escapeId(table)} SET ${updateFields} WHERE id = ?`;
      sqlParams.push(...Object.values(data), id);
      break;

    case 'patch':
      if (!id) throw new Error('ID is required for patch operations');
      const patchFields = Object.keys(data).map(key => `${mysql.escapeId(key)} = ?`).join(', ');
      sql = `UPDATE ${mysql.escapeId(table)} SET ${patchFields} WHERE id = ?`;
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
