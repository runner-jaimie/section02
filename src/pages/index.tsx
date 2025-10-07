import SearchableLayout from '@/components/searchable-layout';
import style from './index.module.css';
import { ReactNode } from 'react';
import BookItem from '@/components/book-item';
import { InferGetStaticPropsType } from 'next';
import fetchBooks from '@/lib/fetch-books';
import fetchRandomBooks from '@/lib/fetch-random-books';

// 서버사이드 렌더링 (SSR) - 매 요청마다 서버에서 데이터를 불러와서 렌더링
// export const getServerSideProps = async () => {
//   // 컴포넌트보다 먼저 실행되어서, 컴포넌트에 필요한 데이터 불러오는 함수
//   // const allBooks = await fetchBooks();  // 이 두함수는 직렬로 함수가 실행 즉 모든 도서를 불러온 후 추천 도서를 불러오기 때문에
//   // const recoBooks = await fetchRandomBooks();

//   // 위의 코드를 아래처럼 바꿔주면 두 함수가 병렬로 실행됨 (동시에 2개의 api가 실행됨)
//   const [allBooks, recoBooks] = await Promise.all([
//     fetchBooks(),
//     fetchRandomBooks(),
//   ]);

//   return {
//     props: { allBooks, recoBooks }, // 컴포넌트에 전달할 데이터
//   };
// };

// SSG로 변경 (정적 사이트 생성) - 빌드 시점에 데이터를 불러와서 정적으로 생성
export const getStaticProps = async () => {
  console.log('getStaticProps 실행됨');

  const [allBooks, recoBooks] = await Promise.all([
    fetchBooks(),
    fetchRandomBooks(),
  ]);

  return {
    props: { allBooks, recoBooks }, // 컴포넌트에 전달할 데이터
  };
};
export default function Home({
  allBooks,
  recoBooks,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {recoBooks.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        {allBooks.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
    </div>
  );
}

Home.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
