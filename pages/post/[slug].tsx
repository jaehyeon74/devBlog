import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import NotionService from "@/services/notion-service";
import type { PostPage } from "@/@types/schema";
import type { ParsedUrlQuery } from "querystring";
import NotionPage from "@/components/NotionPage";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

const Post = ({
  singlePost,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { post, recordMap } = singlePost;

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

      <div className="min-h-screen dark:bg-slate-700 dark:text-white">
        <main className="max-w-5xl mx-auto relative">
          <div className="flex flex-col items-center justify-center">
            <div className="font-extrabold text-2xl mt-2">{post.title}</div>
            <h4 className="text-xs font-medium text-gray-600">
              {dayjs(post.date).format("LL")}
            </h4>
            <article>
              <NotionPage recordMap={recordMap} />
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
    revalidate: 3600,
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
    fallback: "blocking",
  };
}

export default Post;
