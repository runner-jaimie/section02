import {
  //GetServerSidePropsContext,
  GetStaticPropsContext,
  //InferGetServerSidePropsType,
  InferGetStaticPropsType,
} from 'next';
import style from './[id].module.css';
import fetchOneBook from '@/lib/fetch-one-book';

// 동적인 사이트에는 getStaticPaths가 필수이다. 왜냐하면 어떤 페이지를 미리 만들어야 할지 알려줘야 하기 때문이다.
// 그래서 사전 레더링 전에 어떤 경로가 필요한지 경로를 설정해줘야 하기 때문이다.
export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { id: '1' } }, // url 파라미터 값은 문자열로 설정해야 함 왜냐하면 Next.js가 문자열로 인식하기 때문
      { params: { id: '2' } },
      { params: { id: '3' } },
    ],
    fallback: false, // false면 위에서 설정한 경로 외에는 404 페이지를 보여줌. true면 없는 페이지도 서버에서 렌더링 시도
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params?.id;
  const book = await fetchOneBook(Number(id));

  return {
    props: { book },
  };
};

export default function Page({
  book,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
