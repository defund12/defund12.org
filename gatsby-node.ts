import { GatsbyNode } from "gatsby";
import { TemplateQueryData } from "./src/types/TemplateQueryData";

export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
  reporter,
}) => {
  const { createPage, createRedirect } = actions;

  /** Shared logic between creating email and letter pages */
  async function createTemplatePages({
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

  await createTemplatePages({
    layout: "email",
    component: require.resolve("./src/components/email/Email.tsx"),
  });

  await createTemplatePages({
    layout: "letter",
    component: require.resolve("./src/components/letter/Letter.tsx"),
  });

  await createTemplatePages({
    layout: "phone",
    component: require.resolve("./src/components/phone/Phone.tsx"),
  });
};
