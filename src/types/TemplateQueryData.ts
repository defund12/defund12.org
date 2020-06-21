export interface TemplateQueryData {
  allMarkdownRemark: {
    edges: {
      node: {
        frontmatter: {
          permalink: string;
          // eslint-disable-next-line camelcase
          redirect_from?: string[];
        };
      };
    }[];
  };
}
