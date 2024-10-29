import axios from 'axios';

/**
 * Reusable Axios fetcher for Next.js components (server and client).
 * @param {string} endpoint - The API endpoint to fetch.
 * @param {object} queryParams - Query parameters to append to the request URL.
 * @param {object} options - Additional Axios request options (method, headers, body, etc.).
 * @returns {Promise<any>} - The JSON response data.
 */
export async function axiosDataFetcher(endpoint, queryParams = {}, options = {}) {
  // Construct query string from queryParams
  const queryString = new URLSearchParams(queryParams).toString();
  const baseUrl = process.env.AUTH_URL; // Optional base URL from env
  const url = `${baseUrl}/api/${endpoint}${queryString ? `?${queryString}` : ''}`;

  // Create Axios instance with default configurations
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: options.timeout || 5000, // Set timeout (5 seconds default)
    headers: {
      'Content-Type': 'application/json',
      ...options.headers, // Custom headers can be passed
    },
    ...options.config, // Any custom axios config
  });

  // Setup request cancellation (AbortController equivalent for Axios)
  const source = axios.CancelToken.source();

  try {
    // Send the Axios request
    const response = await axiosInstance({
      url: `/api/${endpoint}`, // API endpoint
      method: options.method || 'GET', // Default method is GET
      params: queryParams, // Attach query params if any
      data: ['POST', 'PUT', 'PATCH'].includes(options.method?.toUpperCase()) ? options.body || {} : {}, // Body for POST/PUT
      cancelToken: source.token, // Attach the cancel token
      ...options, // Other Axios request options
    });

    // Return response data
    return response.data;
  } catch (error) {
    // Enhanced error handling
    if (axios.isCancel(error)) {
      console.error('Request canceled:', error.message);
    } else if (error.response) {
      console.error('Axios error response:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Axios general error:', error.message);
    }
    throw new Error(`Data fetching failed: ${error.message}`);
  } finally {
    // Cancel request if needed; don't cancel completed requests
    if (options.cancelRequest) {
      source.cancel('Request aborted.');
    }
  }
}


// // Fetch all news: GET /api/news
// await axiosDataFetcher('/news', {}, { method: 'GET' });

// // Fetch a specific news item by ID: GET /api/news?id=1
// await axiosDataFetcher('/news', { id: 1 }, { method: 'GET' });

// // Filter news by status: GET /api/news?filter=status:approved
// await axiosDataFetcher('/news', { filter: 'status:approved' }, { method: 'GET' });
// filter: {status: 'approved', role: 'admin'}
// sort: {date: 'desc', }
// search: {title: 'GOD'}
// filter=status=approved&
// // Sort news by date: GET /api/news?sort=date:desc
// await axiosDataFetcher('/news', { sort: 'date:desc' }, { method: 'GET' });

// // Search news for a keyword: GET /api/news?search=God
// await axiosDataFetcher('/news', { search: 'God' }, { method: 'GET' });

// // Search news within a date range: GET /api/news?startDate=2023-01-01&endDate=2023-12-31
// await axiosDataFetcher('/news', { startDate: '2023-01-01', endDate: '2023-12-31' }, { method: 'GET' });


// // Create(POST) - Add a new item to the news list:
// async function createNewsItem() {
//   try {
//     const newNewsItem = await axiosDataFetcher('/news', {}, {
//       method: 'POST',
//       body: {
//         data: {
//           title: 'New News Article',
//           content: 'This is the content of the article',
//           author: 'John Doe',
//         },
//       },
//     });

//     if (newNewsItem) {
//
//     }
//   } catch (error) {
//     console.error('Error creating news item:', error.message);
//   }
// }
// // POST /api/news

// // Update(PUT) - Update an existing news item:
// async function updateNewsItem(id) {
//   try {
//     const updatedNewsItem = await axiosDataFetcher('/news', {}, {
//       method: 'PUT',
//       body: {
//         id: id,
//         data: {
//           title: 'Updated News Title',
//           content: 'Updated content for the article',
//         },
//       },
//     });

//     if (updatedNewsItem) {
//
//     }
//   } catch (error) {
//     console.error('Error updating news item:', error.message);
//   }
// }
// // PUT /api/news?id=1

// // Delete(DELETE) - Delete a specific news item:
// async function deleteNewsItem(id) {
//   try {
//     const deleteResponse = await axiosDataFetcher('/news', { id: id }, {
//       method: 'DELETE'
//     });

//     if (deleteResponse) {
//
//     }
//   } catch (error) {
//     console.error('Error deleting news item:', error.message);
//   }
// }
// // DELETE /api/news?id=1


// Passing query params
// const newNewsItem = await axiosDataFetcher('/news', { filter: 'status:approved' }, {
//   method: 'POST',
//   body: {
//     data: {
//       title: 'New News Article',
//       content: 'This is the content of the article',
//       author: 'John Doe',
//     },
//   },
// });


// Patch
// async function updateUserStatus(data) {
//   try {
//     const patchResponse = await axiosDataFetcher('/users', {}, {
//       method: 'PATCH',
//       body: {
//         id: data.id,
//         data: {
//           status: data.status
//         },
//       },
//     });
//     if (!patchResponse) {
//       throw new Error('Failed to update the user');
//     }
//
//     return patchResponse;  // Return success response
//   } catch (error) {
//     // console.error('Error updating user:', error.message);
//     throw error;
//   }
// }
// toast.promise(
//   updateUserStatus(data),
//   {
//     loading: 'Updating user status...',
//     success: <b>User data is updated!</b>,
//     error: <b>Failed to update data.</b>,
//   }
// )


// Delete
// async function deleteUser(id) {
//   try {
//     const deleteResponse = await axiosDataFetcher('/users', { id: id }, {
//       method: 'DELETE',
//     });
//     // Check if the response indicates failure and throw an error
//     if (!deleteResponse) {
//       throw new Error('Failed to delete the user');
//     }
//     //
//     return deleteResponse;  // Return success response
//   } catch (error) {
//     // console.error('Error deleting user:', error.message);
//     throw error;
//   }
// }
// toast.promise(
//   deleteUser(id),
//   {
//     loading: 'Removing user...',
//     success: <b>User is removed!</b>,
//     error: <b>Failed to remove user.</b>,
//   }
// )

