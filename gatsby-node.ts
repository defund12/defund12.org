import { GatsbyNode } from "gatsby";
import { TemplateQueryData } from "./src/types/TemplateQueryData";

export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
  reporter,
}) => {
  const { createPage, createRedirect } = actions;

  /** Shared logic between creating email and letter pages */
  async function createEmailOrLetterTemplatePage({
    layout,
    component,
  }: {
    layout: string;
    component: string;
  }) {
    const templateData = await graphql(`
      {
        allMarkdownRemark(filter: { frontmatter: { layout: { eq: "${layout}" } } }) {
          edges {
            node {
              frontmatter {
                permalink
                redirect_from
              }
            }
          }
        }
      }
    `);

    if (templateData.errors) {
      reporter.panicOnBuild("Error while querying for email data.");
      return;
    }
    (templateData.data as TemplateQueryData).allMarkdownRemark.edges.forEach(
      ({ node }) => {
        // Create individual pages
        createPage({
          path: node.frontmatter.permalink,
          component: component,
          context: {
            permalink: node.frontmatter.permalink,
          },
        });
        // Create redirects
        node.frontmatter.redirect_from?.forEach((redirectFrom) => {
          createRedirect({
            fromPath: redirectFrom,
            toPath: node.frontmatter.permalink,
            isPermanent: true,
          });
        });
      }
    );
  }

  await createEmailOrLetterTemplatePage({
    layout: "email",
    component: require.resolve("./src/components/email/Email.tsx"),
  });

  await createEmailOrLetterTemplatePage({
    layout: "letter",
    component: require.resolve("./src/components/letter/Letter.tsx"),
  });
};
