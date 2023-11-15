/* eslint-disable prettier/prettier */
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import { RichText } from 'prismic-dom';
import ptBR from 'date-fns/locale/pt-BR';
import Head from 'next/head';
import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { getPrismicClient } from '../../services/prismic';
import { getEstimatedTime } from '../../utils/estimatedTime';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const words = post.data.content.reduce((acc, content) => {
    const headingWords = content.heading.split(' ').length;
    const bodyWords = RichText.asText(content.body).split(' ').length;
    console.log(headingWords, bodyWords);
    return acc + headingWords + bodyWords;
  }, 0);

  const estimatedTime = getEstimatedTime(words);
  
  return (
    <>
      <Head>
        <title>Post | spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <Header/>
        <img className={styles.banner} src={post.data.banner.url} alt="banner" />
        <article className={styles.article}>
          <h1>{post.data.title}</h1>
          <div className={styles.infos}>
            <div>
              <FiCalendar/>
              <time>{
                format(
                  new Date(post.first_publication_date),
                  'dd MMM yyyy', { locale: ptBR}
                )}
              </time>
            </div>

            <div>
              <FiUser/>
              <span>{post.data.author}</span>
            </div>

            <div>
              <FiClock/>
              <span>{estimatedTime} min</span>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', {});

  return {
    paths: [],
    fallback: 'blocking'

    // true, false, blocking
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const { slug } = params;
  const response = await prismic.getByUID('posts', slug.toString());

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.main.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: content.body.map(bd => {
            return {
              text: bd.text,
            }
          })
        }
      })
    }
  }

  return {
    props: {
      post,
    }
  }
};
