import { BlogPost, PostPage } from "@/@types/schema";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

export default class NotionService {
  client: Client;
  notionToMarkdown: NotionToMarkdown;

  constructor() {
    this.client = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
    this.notionToMarkdown = new NotionToMarkdown({ notionClient: this.client });
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
          property: "Updated",
          direction: "descending",
        },
      ],
    });

    return response.results.map((res) =>
      NotionService.pageToPostTransformer(res)
    );
  }

  async getSingleBlogPost(slug: string): Promise<PostPage> {
    let post, markdown;

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
          property: "Updated",
          direction: "descending",
        },
      ],
    });

    if (!response.results[0]) {
      throw "No results available";
    }

    const page = response.results[0];

    const mdBlocks = await this.notionToMarkdown.pageToMarkdown(page.id);
    markdown = this.notionToMarkdown.toMarkdownString(mdBlocks);
    post = NotionService.pageToPostTransformer(page);

    return {
      post,
      markdown,
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
        cover =
          "https://images.unsplash.com/photo-1483401757487-2ced3fa77952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1773&q=80";
    }
    return {
      id: page.id,
      cover: cover,
      title: page.properties.Name.title[0].plain_text,
      tags: page.properties.Tags.multi_select,
      description: page.properties.Description.rich_text[0].plain_text,
      date: page.properties.Updated.last_edited_time,
      slug: page.properties.Slug.formula.string,
    };
  }
}
