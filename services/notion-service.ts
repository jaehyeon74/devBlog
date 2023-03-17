import { BlogPost, PostPage } from "@/@types/schema";
import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";

export default class NotionService {
  client: Client;
  notion: NotionAPI;

  constructor() {
    this.client = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
    this.notion = new NotionAPI();
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    const database = process.env.NOTION_BLOG_DATABASE_ID ?? "";
    const response = await this.client.databases.query({
      database_id: database,
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
      sorts: [
        {
          property: "Created",
          direction: "descending",
        },
      ],
    });

    return response.results.map((res) =>
      NotionService.pageToPostTransformer(res)
    );
  }

  async getSingleBlogPost(slug: string): Promise<PostPage> {
    const database = process.env.NOTION_BLOG_DATABASE_ID ?? "";
    const response = await this.client.databases.query({
      database_id: database,
      filter: {
        property: "Slug",
        formula: {
          string: {
            equals: slug,
          },
        },
      },
      sorts: [
        {
          property: "Created",
          direction: "descending",
        },
      ],
    });

    if (!response.results[0]) {
      throw "No results available";
    }

    const page = response.results[0];

    const post = NotionService.pageToPostTransformer(page);
    const recordMap = await this.notion.getPage(page.id);

    return {
      post,
      recordMap,
    };
  }

  private static pageToPostTransformer(page: { [key: string]: any }): BlogPost {
    let cover = page.cover;

    switch (cover.type) {
      case "file":
        cover = page.cover.file;
        break;
      case "external":
        cover = page.cover.external.url;
        break;
      default:
        cover = "";
    }

    return {
      id: page.id,
      cover: cover,
      title: page.properties.Name.title[0].plain_text,
      tags: page.properties.Tags.multi_select,
      description: page.properties.Description.rich_text[0].plain_text,
      date: page.properties.Created.created_time,
      slug: page.properties.Slug.formula.string,
    };
  }
}
