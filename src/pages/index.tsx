/* eslint-disable prettier/prettier */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi'
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { getPrismicClient } from '../services/prismic';

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
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

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
        <div className={styles.linkContent}>
          {
            posts.map(post => (
              <Link key={post.uid} href={`/posts/${post.uid}`}>
                <a>
                  <h1>{post.data.title}</h1>
                  <h4>{post.data.subtitle}</h4>
                  <p>
                    <div>
                      <FiCalendar/>
                      <time>
                        {
                          // post.first_publication_date
                        format(
                          new Date(post.first_publication_date),
                          'dd MMM yyyy',
                          { locale: ptBR, }
                        )
                       }
                      </time>
                    </div>
                    <div>
                      <FiUser/>
                      <span>{post.data.author}</span>
                    </div>
                  </p>
                </a>
              </Link>
              )
            )
          }
        </div>
          {
            nextPage && (
              <button
                type="button"
                className={styles.loadMore}
                onClick={async () => {
                  const response = await fetch(nextPage);
                  const data = await response.json();

                  setNextPage(data.next_page);

                  const newPosts = data.results.map(post => {
                    return {
                      uid: post.uid,
                      first_publication_date: post.first_publication_date,
                      data: {
                        title: post.data.title,
                        subtitle: post.data.subtitle,
                      }
                    }
                  })

                  setPosts([...posts, ...newPosts]);
                }}
              >
                Carregar mais posts
              </button>
            )
          }
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts',
  {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author', 'posts.main', 'posts.content' ],
    pageSize: 4,
  });
  
  // console.log(JSON.stringify(postsResponse, null, 2))
  // console.log(postsResponse.next_page);
  const posts = postsResponse.results.map((post) => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      },
    };
  })


  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts
      }
    },
    revalidate: 60 * 5 // 30 min
  }
};
