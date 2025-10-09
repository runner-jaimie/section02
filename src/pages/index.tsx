import SearchableLayout from '@/components/searchable-layout';
import style from './index.module.css';
import { ReactNode } from 'react';
import BookItem from '@/components/book-item';
import { InferGetStaticPropsType } from 'next';
import fetchBooks from '@/lib/fetch-books';
import fetchRandomBooks from '@/lib/fetch-random-books';
import Head from 'next/head';

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
    props: {
      allBooks,
      recoBooks,
    }, // 컴포넌트에 전달할 데이터
    // ISR 설정 SSG(매우 빠른 속도로 응답가능) + SSR(최신 데이터 반영 가능) 이 두가지를 모두 만족 하는 방법
    revalidate: 3, // 설정한 초마다 페이지를 재생성 (ISR - Incremental Static Regeneration)
  };
};
export default function Home({
  allBooks,
  recoBooks,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>한입북스</title>
        <meta property="og:image" content="/thumbnail.png" />
        <meta property="og:title" content="한입북스" />
        <meta
          property="og:description"
          content="한입북스에 등록된 도서들을 만나보세요!"
        />
      </Head>
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
    </>
  );
}

Home.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};

// ISR을 적용하기 어려운 경우
// 시간과 관계없이 사용자의 행동에 따라 데이터가 없데이트 되는 경우
// ex) 게시판, 댓글, 좋아요, 주문하기 등 (왜냐면 사용자가 언제 어떤 행동을 할지 모르기 때문에)
// 이런 경우는 SSR을 사용하는 것이 더 적합
// ISR은 설정한 시간마다 페이지를 재생성 하기 때문에, 사용자의 행동에 따라 데이터가 자주 변경되는 경우에는 최신 데이터를 반영하지 못할 수 있음
// 따라서 이런 경우에는 매 요청마다 최신 데이터를 불러오는 SSR이 더 적합

// ISR을 적용하기 좋은 경우
// 자주 변경되지 않는 데이터, 예를 들어 블로그 글, 상품 목록, 뉴스 기사 등
// 이런 경우에는 ISR을 사용하여 일정 시간마다 페이지를 재생성함으로써, 빠른 응답 속도와 최신 데이터 반영을 모두 만족할 수 있음

// 결론적으로, ISR과 SSR 중 어떤 방식을 사용할지는 애플리케이션의 특성과 요구사항에 따라 다름
// 자주 변경되지 않는 데이터는 ISR을 사용하고, 자주 변경되는 데이터는 SSR을 사용하는 것이 일반적인 권장 사항임

// ISR과 SSR을 혼합하여 사용하는 것도 가능
// 예를 들어, 메인 페이지는 ISR로 생성하고, 상세 페이지는 SSR로 처리하는 방식
// 이렇게 하면 메인 페이지는 빠른 응답 속도를 유지하면서도, 상세 페이지에서는 최신 데이터를 반영할 수 있음

// Next.js에서는 getStaticProps에서 revalidate 옵션을 설정하여 ISR을 쉽게 구현할 수 있음
// getServerSideProps를 사용하여 SSR을 구현할 수 있음
// 애플리케이션의 요구사항에 따라 적절한 방식을 선택하여 사용하면 됨

// ISR과 SSR을 적절히 활용하면, 사용자에게 빠르고 최신의 경험을 제공할 수 있음
// 애플리케이션의 특성과 요구사항을 잘 분석하여, 최적의 렌더링 방식을 선택하는 것이 중요함

// On-Demand ISR (Next.js 13.4 이상에서 지원) 요청을 받을 때 마다 페이지를 재생성하는 것이 아니라,
// 특정 이벤트(예: 데이터 변경, 관리자 요청 등)가 발생했을 때 페이지를 재생성하는 방식
// 이를 통해 불필요한 페이지 재생성을 줄이고, 필요한 시점에만 최신 데이터를 반영할 수 있음
