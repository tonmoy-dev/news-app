import axios from 'axios';

// Data Fetcher using Fetch API
export async function apiRequestHandler(endpoint, queryParams = {}, options = {}) {
  const { id, filter, sort, search, dateRange, page = 1, limit = 10, ...otherParams } = queryParams;

  // Construct the base URL
  const baseUrl = process.env.AUTH_URL || '';

  // Build the query string including pagination
  const queryString = buildQueryString({ id, filter, sort, search, dateRange, page, limit, ...otherParams });
  const url = `${baseUrl}/api${endpoint}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      ...options,
      next: {
        ...options.next,
        // revalidate: options.next?.revalidate || 10,
      },
      cache: options.cache || 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetching error:', error);
    throw new Error(`Data fetching failed: ${error.message}`);
  }
}

/**
 * Reusable Axios fetcher for Next.js components (server and client).
 * @param {string} endpoint - The API endpoint to fetch.
 * @param {object} queryParams - Query parameters to append to the request URL.
 * @param {object} options - Additional Axios request options (method, headers, body, etc.).
 * @returns {Promise<any>} - The JSON response data.
 */
export async function axiosRequestHandler(endpoint, queryParams = {}, options = {}) {
  // Extract query parameters with defaults
  const { id, filter, sort, search, dateRange, page, limit, ...otherParams } = queryParams;

  // Construct the base URL
  const baseUrl = process.env.AUTH_URL;

  // Build the query string including pagination and other params
  const queryString = buildQueryString({ id, filter, sort, search, dateRange, page, limit, ...otherParams });
  const url = `${baseUrl}/api${endpoint}${queryString ? `?${queryString}` : ''}`;

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
      url, // Use the constructed URL
      method: options.method || 'GET', // Default method is GET
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

/**
 * Helper function to build the query string based on different conditions.
 * Supports `id`, `filter`, `sort`, `search`, `dateRange`, `page`, `limit`, and any other generic params.
 */
function buildQueryString({ id, filter, sort, search, dateRange, page, limit, ...otherParams }) {
  const params = new URLSearchParams();

  // Handle ID query
  if (id) {
    params.append('id', id);
  }

  // Handle filter queries (array of objects)
  if (filter && Array.isArray(filter)) {
    filter.forEach(f => {
      Object.entries(f).forEach(([key, value]) => {
        params.append(`filter[${key}]`, value);
      });
    });
  }

  // Handle sort queries (array of objects)
  if (sort && Array.isArray(sort)) {
    sort.forEach(s => {
      Object.entries(s).forEach(([key, value]) => {
        params.append(`sort[${key}]`, value);
      });
    });
  }

  // Handle search queries (array of objects)
  if (search && Array.isArray(search)) {
    search.forEach(s => {
      Object.entries(s).forEach(([key, value]) => {
        params.append(`search[${key}]`, value);
      });
    });
  }

  // Handle date range query (startDate and endDate)
  if (dateRange && dateRange.startDate && dateRange.endDate) {
    params.append('startDate', dateRange.startDate);
    params.append('endDate', dateRange.endDate);
  }

  // Handle pagination
  if (page) {
    params.append('page', page);
  }
  if (limit) {
    params.append('limit', limit);
  }

  // Add any remaining generic query params
  Object.entries(otherParams).forEach(([key, value]) => {
    params.append(key, value);
  });

  return params.toString(); // Convert the URLSearchParams object to a query string
}

/* GET

1. ** Fetching by ID **:

```javascript
const fetchById = async () => {
  const data = await dataFetcher('/users', { id: 1 });

};

fetchById();
```

2. ** Filter Example **:

```javascript
const fetchFilteredData = async () => {
  const data = await dataFetcher('/users', {
    filter: [
      { name: 'John' },
      { status: 'active' }
    ]
  });

};

fetchFilteredData();
```

3. ** Sort Example **:

```javascript
const fetchSortedData = async () => {
  const data = await dataFetcher('/products', {
    sort: [
      { price: 'asc' },
      { name: 'desc' }
    ]
  });

};

fetchSortedData();
```

4. ** Search Example **:

```javascript
const searchProducts = async () => {
  const data = await dataFetcher('/products', {
    search: [
      { title: 'Coffee' },
      { status: 'available' }
    ]
  });

};

searchProducts();
```

5. ** Combining Multiple Query Types **:

```javascript
const fetchComplexQuery = async () => {
  const data = await dataFetcher('/products', {
    id: 2,
    filter: [
      { category: 'Coffee' },
      { status: 'available' }
    ],
    sort: [
      { price: 'asc' }
    ],
    search: [
      { title: 'Latte' }
    ]
  });

};

fetchComplexQuery();
```

6. Fetching Data by Date Range:

```javascript
const fetchDataByDateRange = async () => {
  const data = await dataFetcher('/orders', {
    dateRange: {
      startDate: '2023-01-01',
      endDate: '2023-01-31'
    }
  });
*/
