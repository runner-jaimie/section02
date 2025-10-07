import {
  //GetServerSidePropsContext,
  GetStaticPropsContext,
  //InferGetServerSidePropsType,
  InferGetStaticPropsType,
} from 'next';
import style from './[id].module.css';
import fetchOneBook from '@/lib/fetch-one-book';
import { useRouter } from 'next/router';

// 동적인 사이트에는 getStaticPaths가 필수이다. 왜냐하면 어떤 페이지를 미리 만들어야 할지 알려줘야 하기 때문이다.
// 그래서 사전 레더링 전에 어떤 경로가 필요한지 경로를 설정해줘야 하기 때문이다.
// fallback: false면 설정한 경로 외에는 404 페이지를 보여줌. true면 없는 페이지도 서버에서 렌더링 시도
// fallback: 'blocking'은 없는 페이지에 대해 서버에서 렌더링 시도하고(ssr 방식, 완료될 때까지 기다렸다가 완성된 페이지를 보여줌 그래서 조금 느림
// 하지만 한번 페이지가 생성되면 ssg 처럼 빠름 (ssr+ssg 혼합하는 방식 같은 느낌)
// fallback: true는 없는 페이지에 대해 서버에서 렌더링 시도하지만 (ssr 방식) 완료될 때까지 기다리지 않고 바로 빈 페이지를 (데이터가 없는 페이지)보여줌
// props가 없는 상태로 페이지를 빠르게 생성해서 보여주고 (csr 방식) 그 후에 클라이언트에서 데이터를 불러와서 페이지를 완성시킴
// 즉 페이지가 완성되면 클라이언트에서 다시 렌더링해서 완성된 페이지를 보여줌 (ssr+csr 혼합하는 방식 같은 느낌)
export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { id: '1' } }, // url 파라미터 값은 문자열로 설정해야 함 왜냐하면 Next.js가 문자열로 인식하기 때문
      { params: { id: '2' } },
      { params: { id: '3' } },
    ],
    fallback: true,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params?.id;
  const book = await fetchOneBook(Number(id));

  if (!book) {
    return {
      notFound: true,
    };
  }

  return {
    props: { book },
  };
};

export default function Page({
  book,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>책을 찾을 수 없습니다.</div>;
  }

  const {
    //id,
    title,
    subTitle,
    author,
    publisher,
    description,
    coverImgUrl,
  } = book;

  return (
    <div className={style.container}>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <img src={coverImgUrl} />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </div>
  );
}
