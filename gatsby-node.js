const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require("path")
const handlebars = require('handlebars');

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage, createRedirect } = actions;
  const emailComponent = require.resolve("./src/components/email/Email.tsx");


  const emailData = await graphql(`
    {
      allMarkdownRemark(filter: { frontmatter: { layout: { eq: "email" } } }) {
        edges {
          node {
            frontmatter {
              permalink
              redirect_from
              city
              state
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
  emailData.data.allMarkdownRemark.edges.forEach(async ({ node }) => {
    // Create individual pages
    createPage({
      path: node.frontmatter.permalink,
      component: emailComponent,
      context: {
        permalink: node.frontmatter.permalink,
        city: node.frontmatter.city,
        state: node.frontmatter.state
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
};

/**
 * To generate meta previews
 * Uses puppeteer 
*/

//initialize global variables
let browser = null;
let previewTemplate = null;
let template;

//at start of build process, launch Puppeteer instance and read the template file
exports.onPreInit = async () => {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    previewTemplate = fs.readFileSync(path.resolve(__dirname, "imageGeneration/previewImage.html"), "utf8");
    template = handlebars.compile(previewTemplate)
};

//for every node which is an email, generate a preview image
exports.onCreateNode = async ({ node, actions }) => {
  if(node.context && node.context.state){ //check to see if it contains state(to see if it is an email)
    //check if file already exists; only generate if it doesn't
    fs.access("./public/images/"+node.context.permalink+".png", fs.F_OK, async (err) => { 
      if (err) {
        let content={city:node.context.city, state:node.context.state}
        let html = template(content, { waitUntil: "load" }) 
        const page = await browser.newPage();
        await page.setContent(html);
        await page.evaluateHandle("document.fonts.ready");
        let element = await page.$('body');
        await element.screenshot({path : "./public/images/"+node.context.permalink+".png"})
      } 
    })
  } 
}

//close Puppeteer instance after build
exports.onPostBuild = async () => {
  // Close the browser at the end
  await browser.close();
};