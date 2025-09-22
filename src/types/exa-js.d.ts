declare module "exa-js" {
  export default class Exa {
    constructor(apiKey: string);
    searchAndContents(
      query: string,
      options?: {
        summary?: boolean | { query?: string };
        text?: boolean;
        type?: string;
        numResults?: number;
      },
    ): Promise<{
      requestId?: string;
      resolvedSearchType?: string;
      results: Array<{
        id?: string;
        title?: string;
        url?: string;
        publishedDate?: string;
        author?: string;
        score?: number;
        summary?: string;
        image?: string;
        favicon?: string;
      }>;
    }>;
  }
}
