# Defund12.org

[**Defund12.org**](https://defund12.org/) provides shareable links to email the government officials in your community and demand action towards defunding police departments in favor of education, social services, and efforts towards dismantling racial injustice.

## Join the conversation

We are dealing with a high volume of requests, but we are doing our best to stay up to date with our community on Discord. [**Join our Discord server**](https://discord.gg/VhGyXWa) for questions, discussions, and to join a [team](#team-organization).

## Development

### With Docker

1. Clone the repo:

   ```bash
   git clone git@github.com:defund12/defund12.org.git
   ```

2. Install [Docker](https://docs.docker.com/get-docker/)

3. Run `docker-compose up`

### Without Docker

1. Clone the repo:

   ```bash
   git clone git@github.com:defund12/defund12.org.git
   ```

2. Install [Node Version Manager](https://github.com/nvm-sh/nvm) or [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows)
   
   **Linux/MacOS** (pick either method)

   a. Homebrew:

   Install [Homebrew](https://brew.sh/), and:

   ```bash
   brew bundle
   ```

   b. Plain bash:
   
   ```bash
   wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
   ```

   **Windows**:

   Install [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows) using its installer.
   

3. Install Node via nvm:

   ```bash
   nvm install
   ```

4. Install JS dependencies:

   ```bash
   yarn install --frozen-lockfile
   ```

5. Start the app:

   ```bash
   yarn start-dev
   ```

### Running eslint

1. If you haven't already, install JS dependencies: `yarn install --frozen-lockfile`
2. To run eslint and automatically fix issues:
   `./node_modules/.bin/eslint --fix .`

### Running tests

#### JS tests

1. If you haven't already, install JS dependencies: `yarn install --frozen-lockfile`
2. `yarn test`

#### Markdown tests

- [/test/markdown/README.md](./test/markdown/README.md)

## Contribution guidelines

Contributions to the repository are greatly welcomed.

### Team organization

The teams and responsibilities/definitions are closely related to how issue(email) creation, review, and site additions happen. Please review team definitions on the [Teams README](TEAMS.md).

NOTE: All work that people are doing to further defund12.org is important and helpful. However in order to keep things moving efficently, we have defined teams and responsibilities so that we can move forward together in an efficent manner.

### Email templates

Please **review our [email template style guide](EMAIL_TEMPLATE_STYLE_GUIDE.md)**. All messages go through basic fact-checking and editorial review before they are published. Following the style guide makes this process go quicker!

NOTE: If possible, limit one email template per PR. This make it easier to process the history of what’s entering the codebase, and takes some strain off the reviewer.

---

Thank you so much,\
defund12.org team
