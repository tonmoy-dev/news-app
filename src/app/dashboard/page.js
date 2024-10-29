// import styles from "./page.module.css";
import Dashboard from "@/components/dashboard/main/dashboard";
import { auth } from "@/utils/auth";
import fetchData from "@/utils/fetchData";
import { apiRequestHandler } from "@/utils/requestHandlers";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth();

  // Variables to store fetched data
  let newsData = [];
  let reportersData = [];
  let totalPendingNews = 0;
  let editorsData = [];
  let inboxData = [];

  const { role, email, id } = session?.user;

  const usersData = await apiRequestHandler('/users', {
    filter: [
      { email: email }
    ],
  });
  const user = usersData?.[0];

  // Fetch data based on user role
  if (role === 'admin') {
    // Admin and editor roles can access all data
    newsData = await fetchData('/api/news');
    reportersData = await apiRequestHandler('/users', { filter: [{ role: 'reporter' }] });
    editorsData = await apiRequestHandler('/users', { filter: [{ role: 'editor' }] });
    totalPendingNews = newsData?.filter(news => news.status === 'Pending').length;
    inboxData = await fetchData('/api/inbox');
  } else if (role === 'reporter' || role === 'editor') {
    newsData = await fetchData(`/api/news?reporter=${user?.full_name}`);
  } else if (role === 'user') { }

  return (
    <>
      <Dashboard
        user={user}
        totalNews={newsData?.length}
        totalEditors={editorsData?.length}
        totalPendingNews={totalPendingNews}
        totalReporters={reportersData?.length}
        totalMails={inboxData?.length}
      />
    </>
  );
}
