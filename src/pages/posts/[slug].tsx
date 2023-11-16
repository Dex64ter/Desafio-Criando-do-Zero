/* eslint-disable prettier/prettier */
/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import { RichText } from 'prismic-dom';

import ptBR from 'date-fns/locale/pt-BR';
import Head from 'next/head';
import Header from '../../components/Header';

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
    const totalWords = RichText.asText(content.body).split(' ').length;

    return acc + headingWords + totalWords;
  }, 0);

  const estimatedTime = getEstimatedTime(words);

  const router = useRouter();
  if (router.isFallback) {
    return <span> Carregando...</span>
  }
  
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

          <div className={styles.content}>
            {
              post.data.content.map(content => (
                <div key={content.heading}>
                  <h2>{content.heading}</h2>
                  <div className={styles.contentText}>
                    <div dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body)}}/>
                  </div>
                </div>
              ))
            }
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
    paths: posts.results.map(post => (
      {
        params: { slug: post.uid }
      }
    )),

    fallback: true

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
      content: response.data.content
    }
  }

  return {
    props: {
      post,
    }
  }
};
