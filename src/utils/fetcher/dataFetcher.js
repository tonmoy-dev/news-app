// Fetcher for server components

export async function dataFetcher(endpoint, queryParams = {}, options = {}) {
  // Construct the query string from queryParams
  const queryString = new URLSearchParams(queryParams).toString();
  const baseUrl = process.env.AUTH_URL; // Ensure environment variable is set
  const url = `${baseUrl}/api${endpoint}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      ...options,
      next: {
        ...options.next,
        // Optionally use tags and revalidate for ISR or caching
        // tags: options.next?.tags || [],
        // revalidate: options.next?.revalidate || 10, // Default revalidation (ISR) to 10 seconds
      },
      cache: options.cache || 'no-store', // Default to 'no-store' caching if not specified
    });

    // Handle non-200 response
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
    }

    // Return the parsed JSON data
    return await response.json();
  } catch (error) {
    console.error('Fetching error:', error);
    // throw new Error(`Data fetching failed: ${error.message}`);
  }
}


// const allNews = await dataFetcher('/news', {}, { method: 'GET' });
// // GET /api/news

// const specificNews = await dataFetcher('/news', { id: 1 }, { method: 'GET' });
// // GET /api/news?id=1

// const filteredNews = await dataFetcher('/news', { filter: 'status:approved' }, { method: 'GET' });
// // GET /api/news?filter=status:approved

// const sortedNews = await dataFetcher('/news', { sort: 'date:desc' }, { method: 'GET' });
// // GET /api/news?sort=date:desc

// const searchResults = await dataFetcher('/news', { search: 'God' }, { method: 'GET' });
// // GET /api/news?search=God

// const newsWithinDateRange = await dataFetcher('/news', { startDate: '2023-01-01', endDate: '2023-12-31' }, { method: 'GET' });
// // GET /api/news?startDate=2023-01-01&endDate=2023-12-31
