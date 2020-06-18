exports.createPages = async ({actions, graphql, reporter}) => {
  const {createPage, createRedirect} = actions;

  /** Shared logic between creating email and letter pages */
  async function createPagesHelper({layout, component}) {
    const emailData = await graphql(`
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

    if (emailData.errors) {
      reporter.panicOnBuild("Error while querying for email data.");
      return;
    }
    emailData.data.allMarkdownRemark.edges.forEach(({node}) => {
      // Create individual pages
      createPage({
        path: node.frontmatter.permalink,
        component: component,
        context: {
          permalink: node.frontmatter.permalink,
        },
      });
      // Create redirects
      if (node.frontmatter.redirect_from) {
        node.frontmatter.redirect_from.forEach((redirectFrom) => {
          createRedirect({
            fromPath: redirectFrom,
            toPath: node.frontmatter.permalink,
            isPermanent: true,
          });
        });
      }
    });
  }

  await createPagesHelper({
    layout: "email",
    component: require.resolve("./src/components/email/Email.tsx"),
  });

  await createPagesHelper({
    layout: "letter",
    component: require.resolve("./src/components/letter/Letter.tsx"),
  });
};
