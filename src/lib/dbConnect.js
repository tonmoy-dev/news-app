import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

let pool;

const createPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.NEXT_PUBLIC_DB_HOST,
      user: process.env.NEXT_PUBLIC_DB_USER,
      password: process.env.NEXT_PUBLIC_DB_PASSWORD,
      database: process.env.NEXT_PUBLIC_DB_DATABASE,
      port: process.env.NEXT_PUBLIC_DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
};

export const query = async (sql, params) => {
  try {
    const pool = createPool();
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error; // Rethrow to handle it in the calling function
  }
};


// For using custom servers
// export const closePool = async () => {
//   if (pool) {
//     await pool.end();
//
//   }
// };
// Call closePool when shutting down the app manually if required.
