/* eslint-disable prettier/prettier */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <h2>
          <img src='/images/Vector.svg' alt="logo da página" />
          spacetraveling <span>.</span>
        </h2>
        <div>
          {
            // postsPagination.results.map(post => {

            // })
          }
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts',
  {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author', 'posts.main', 'posts.content' ],
    pageSize: 2,
  });
  
  // console.log(JSON.stringify(postsResponse, null, 2))

  const posts = postsResponse.results.map((post) => {
    return {
      uid: post.uid,
      first_publication_date: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      },
    };
  })


  return {
    props: {
      posts,      
    }
  }
};
