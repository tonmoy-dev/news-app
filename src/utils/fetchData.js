export default async function fetchData(endpoint) {
  const res = await fetch(`${process.env.AUTH_URL}${endpoint}`, {
    next: {}, // { revalidate: 10 }
    cache: 'no-store'
  });

  if (!res.ok) throw new Error('Error on fetching data!');

  return res.json()
}
