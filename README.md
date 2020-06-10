# Defund12.org

Defund12.org provides shareable links to email the government officials in your community and demand action towards defunding police departments in favor of education, social services, and efforts towards the dismantling of racial inequality.

## Join the conversation

We are dealing with a high volume of requests, but we are doing our best to stay up to date with our community on Discord. Join the conversation [here](https://discord.gg/YMxndzd).

## Development

To build the application:

1. Install [Jekyll](https://jekyllrb.com/docs/installation/)
2. Install [Node JS](https://nodejs.org/en/download/)
3. Install [Yarn](https://classic.yarnpkg.com/en/docs/install)
4. Clone and navigate to the repository
5. `bundle exec jekyll serve`

### Running with Docker locally

1. [Install Docker](https://docs.docker.com/get-docker/)
2. Start docker locally
3. In directory run, `docker-compose up`

### Running eslint

1. `yarn install`
2. To run eslint and automatically fix issues:
   `./node_modules/.bin/eslint --fix .`

### Running tests

#### Js Tests
1. `yarn install` && `yarn test`

#### Markdown Tests
[/test/markdown/README.md](./test/markdown/README.md)

## Contributions guidelines

Contributions to the repository are greatly welcomed.

### Team Organization

The teams and responsibilities/definitions are closely related to how issue(email) creation, review, and site additions happen. Please review team definitions on the [teams readme](TEAMS.md).

NOTE: All work that people are doing to further defund12.org is important and helpful. However in order to keep things moving efficently, we have defined teams and responsibilities so that we can move forward together in an efficent manner.

### Email templates

Please review our email template style guide [here](EMAIL_TEMPLATE_STYLE_GUIDE.md).

NOTE: If possible, limit a PR to one email template. This make it easier to process the history of what's entering the codebase, and takes some strain off the reviewer.

Thank you so much,\
defund12.org team
