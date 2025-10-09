import { BookData } from '@/types';

export default async function fetchBooks(q?: string): Promise<BookData[]> {
  let url = 'https://onebite-books-server-main-six-gamma.vercel.app/book';

  if (q) {
    url += `/search?q=${q}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('네트워크 응답에 문제가 있습니다.');
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
