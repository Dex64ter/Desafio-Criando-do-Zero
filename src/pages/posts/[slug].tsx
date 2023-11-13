/* eslint-disable prettier/prettier */
import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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

export default function Post({ posts }: PostProps) {
  <>
  </>
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts',
  {
    // fetch: ['posts.title', 'posts.subtitle', 'posts.author', 'posts.main', 'posts.content' ],
    pageSize: 2,
  });

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

  

  return {
    props: {}
  }
};
