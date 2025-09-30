import Link from 'next/link';
import style from './global-layout.module.css';

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={style.container}>
      <header className={style.header}>
        <Link href={'/'}>📚 ONBITE BOOKS</Link>
      </header>
      <main>{children}</main>
      <footer className={style.footer}>제작 @Jaimie</footer>
    </div>
  );
}
