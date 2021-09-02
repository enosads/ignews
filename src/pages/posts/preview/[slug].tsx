import {GetStaticPaths, GetStaticPathsResult, GetStaticProps} from "next";
import {getPrismicClient} from "../../../services/prismic";
import {RichText} from "prismic-dom";
import Link from 'next/link'
import Head from 'next/head';
import styles from '../post.module.scss'
import {useSession} from "next-auth/client";
import {useEffect} from "react";
import {useRouter} from "next/router";

type Post = {
  slug: string;
  title: string;
  updatedAt: Date;
  content: string;
}

interface PostPreviewProps {
  post: Post;
}

export default function PostPreview ({post}: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session])

  return (
    <>
      <Head>
        <title>
          {post.title} | Ignews
        </title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{__html: post.content}}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subcribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async (): Promise<GetStaticPathsResult> => {
  return {
    paths: [
      {
        params: {
          slug: 'saas-single-tenant-ou-multi-tenant-qual-escolher'
        }

      }
    ],
    fallback: 'blocking' //true, false, 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {

  const {slug} = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {post},
    revalidate: 60 * 30 //30 minutes
  }
}
