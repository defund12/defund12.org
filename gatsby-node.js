exports.createPages = async ({actions, graphql, reporter}) => {
  const {createPage} = actions;

  const emailComponent = require.resolve('./src/components/email/Email.tsx');

  const emailData = await graphql(`
    {
        allMarkdownRemark(filter: {frontmatter: {layout: {eq: "email"}}}) {
            edges {
                node {
                    frontmatter {
                        permalink
                    }
                }
            }
        }
    }
  `);

  if (emailData.errors) {
    reporter.panicOnBuild('Error while querying for email data.');
    return;
  }
  emailData.data.allMarkdownRemark.edges.forEach(({node}) => {
    createPage({
      path: node.frontmatter.permalink,
      component: emailComponent,
      context: {
        permalink: node.frontmatter.permalink,
      },
    });
  });
};
