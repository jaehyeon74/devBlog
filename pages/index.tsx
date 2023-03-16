import { BlogPost } from "@/@types/schema";
import BlogCard from "@/components/BlogCard";
import NotionService from "@/services/notion-service";
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";

const Home: NextPage = ({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const title = `Jay's DevBlog`;
  const description = "Welcome to my Notion Blog";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name={"description"}
          title={"description"}
          content={description}
        />
        <meta name={"og:title"} title={"og:title"} content={title} />
        <meta
          name={"og:description"}
          title={"og:description"}
          content={title}
        />
      </Head>

      <main className="min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center">
            <h1 className="font-extrabold text-xl md:text-4xl text-black text-center">
              {`재현의 개발블로그`}
            </h1>
          </div>
          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none">
            {posts.map((post: BlogPost) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-12 max-w-lg mx-auto grid gap"></div>
        </div>
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const notionService = new NotionService();
  const posts = await notionService.getPublishedBlogPosts();

  return {
    props: { posts },
    revalidate: 3600,
  };
};
