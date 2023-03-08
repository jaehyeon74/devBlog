import { GetStaticProps, InferGetStaticPropsType } from "next";
import ReactMarkdown from "react-markdown";
import Head from "next/head";
import NotionService from "@/services/notion-service";
import { PostPage } from "@/@types/schema";
import { ParsedUrlQuery } from "querystring";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const Post = ({
  singlePost,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { post, markdown } = singlePost;

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta
          name={"description"}
          title={"description"}
          content={post.description}
        />
        <meta name={"og:title"} title={"og:title"} content={post.title} />
        <meta
          name={"og:description"}
          title={"og:description"}
          content={post.description}
        />
        <meta name={"og:image"} title={"og:image"} content={post.cover} />
      </Head>

      <div className="min-h-screen">
        <main className="max-w-5xl mx-auto relative">
          <div className="flex items-center justify-center">
            <article className="prose">
              <MarkdownRenderer markdown={markdown} />
            </article>
          </div>
        </main>
      </div>
    </>
  );
};

type Props = { singlePost: PostPage };
interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const params = context.params!;
  const { slug } = params;
  const notionService = new NotionService();

  const singlePost = await notionService.getSingleBlogPost(slug);

  if (!singlePost) {
    throw "";
  }

  return {
    props: {
      singlePost,
    },
  };
};

export async function getStaticPaths() {
  const notionService = new NotionService();

  const posts = await notionService.getPublishedBlogPosts();
  const paths = posts.map((post) => {
    return `/post/${post.slug}`;
  });

  return {
    paths,
    fallback: false,
  };
}

export default Post;
