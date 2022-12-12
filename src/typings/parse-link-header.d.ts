declare module "parse-link-header" {
  declare namespace parseLinkHeader {
    interface Link {
      [queryParam: string]: string;
      rel: string;
      url?: string;
    }

    interface Links {
      [rel: string | undefined]: Link | undefined;
      next?: Link;
    }
  }

  declare function parse(
    linkHeader: string | null | undefined
  ): parseLinkHeader.Links | null;
  export = parse;
}
