
import { dataFetcher } from "@/utils/fetcher/dataFetcher";
import Footer from "../main/Footer";
import Header from "../main/header";
import ScrollTop from "../main/ScrollTop";

export default async function MainLayout({ children }) {
  const categories = await dataFetcher('/categories', { status: 1 });
  const categoriesNames = categories?.map(item => item.name);

  if (!categoriesNames || categoriesNames?.length === 0) {
    throw new Error('No data found');
  }

  return (
    <>
      <Header categoriesNames={categoriesNames} />
      {children}
      <Footer />
      <ScrollTop />
    </>
  )
}