import { BookData } from '@/types';

export default async function fetchBook(id: number): Promise<BookData | null> {
  const url = `https://onebite-books-server-main-six-gamma.vercel.app/book/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error();
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
