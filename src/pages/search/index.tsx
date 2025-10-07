import SearchableLayout from '@/components/searchable-layout';
import { ReactNode, useEffect, useState } from 'react';
import BookItem from '@/components/book-item';
import //GetServerSidePropsContext,
//GetStaticProps,
// InferGetServerSidePropsType,
// InferGetStaticPropsType,
'next';
import fetchBooks from '@/lib/fetch-books';
import { BookData } from '@/types';
import { useRouter } from 'next/router';

// 서버사이드 렌더링 (SSR) - 매 요청마다 서버에서 데이터를 불러와서 렌더링
// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const q = context.query.q; // 쿼리 파라미터에서 'q' 값을 꺼내옴
//   const books = await fetchBooks(q as string);
//   return {
//     props: { books }, // 컴포넌트에 전달할 데이터
//   };
// };

// SSG로 변경 (정적 사이트 생성) - 빌드 시점에 데이터를 불러와서 정적으로 생성
// 하지만 유저가 검색할 때마다 페이지를 새로 생성해야 하기 때문에 SSG는 적합하지 않음 즉 사전에 모든 검색어에 대한 페이지를 생성할 수 없기 때문
// 사전 렌더링 과정에서는 쿼리 스트링을 불러올 수가 없음 (왜냐면 빌드 시점에 쿼리 스트링이 없기 때문)
// 그래서 만약 SSR로 구현 하고 싶지 않다면 우린 클라이언트 사이드 렌더링(CSR)로 구현해야함
// 즉, 페이지가 로드된 후에 클라이언트(브라우저) 직접 데이터를 불러와서 렌더링하는 방식
// export const getStaticProps = async (context: GetStaticProps) => {
//   const q = context.query.q; // 쿼리 파라미터에서 'q' 값을 꺼내옴
//   const books = await fetchBooks(q as string);
//   return {
//     props: { books }, // 컴포넌트에 전달할 데이터
//   };
// };
// export default function Page({
//   books,
// }: InferGetStaticPropsType<typeof getStaticProps>) {
//   return (
//     <div>
//       {books.map((book) => (
//         <BookItem key={book.id} {...book} />
//       ))}
//     </div>
//   );
// }

export default function Page() {
  const [books, setBooks] = useState<BookData[]>([]);

  const router = useRouter();
  const q = router.query.q;

  const fetchSearchResult = async () => {
    const data = await fetchBooks(q as string);
    setBooks(data);
  };

  useEffect(() => {
    if (q) {
      // q 값이 있을 때만 fetchBooks 호출 (검색 결과를 불러오는 로직 작동)
      fetchSearchResult();
    }
  }, [q]);

  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
