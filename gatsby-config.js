module.exports = {
  siteMetadata: {
    siteUrl: "https://defund12.org",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-transformer-yaml",
      options: {
        typeName: ({ node, object, isArray }) => {
          if (node.base === "_config.yml") {
            return "siteConfig";
          } else {
            return "Yaml";
          }
        },
      },
    },
    "gatsby-transformer-remark",
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-165430856-2",
        head: false,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "src",
        path: `${__dirname}/src`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "emails",
        path: `${__dirname}/_emails/`,
        ignore: ["README.md"],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        typeName: "config",
        name: "config",
        path: `${__dirname}/_config.yml`,
      },
    },
    "gatsby-plugin-sitemap",
    "gatsby-plugin-client-side-redirect",
  ],
};
