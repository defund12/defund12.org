# Contributing to defund12.org

Do you want to help with the project? Awesome! We can definitely use it. This project started off as the work of a single person but has exploded in several days to encompass a distributed team of volunteers all around the country (and maybe world?). We are still trying to figure out the best processes, it's a bit hectic!

First off, read below to check out the possible ways in which you could help. Then, once you have a rough idea of how we operate, please join our [Discord server](https://discord.gg/YMxndzd) and say hello! There is a separate channel for each team.

For all tasks you will need a GitHub account. If you ever need permissions for something (e.g. to adjust labels on issues), submit a [permissions request](https://github.com/defund12/defund12.org/issues/new?assignees=&labels=admin-attention&template=TRIAGE_ACCESS.md&title=Triage+access+for+%5BUSERNAME%5D).

## 1. Writing team (non-technical)

If there is no email yet for your city, it would be awesome if you wrote one!

- Read the [email style guidelines](/docs/email_style.md).
- Go to the list of current [Issues](https://github.com/defund12/defund12.org/issues)
- Click on `New issue`, and then select the `Add an email for your city` option.
- Write your email, following the style guide. Include the email addresses of your representatives. Click `Submit new issue`.
- You can bookmark the URL of the created issue so you can check back and comment as volunteers review, format, and publish your email. You should also receive email updates.

## 2. Triage Team (non-technical)

A person on the triage team is the first to review newly created issues. They filter out any spam and kick off the review process for emails.

- Find the oldest issue with the <kbd>new-request</kbd> label.
- Read the [email style guidelines](/docs/email_style.md).
- Is it possible to salvage the email so that it follows the guidelines? Or is it totally unintelligible, or missing key info? If not salvageable, **close issue** and reply with the contents of the [email request template](https://raw.githubusercontent.com/defund12/defund12.org/gh-pages/.github/ISSUE_TEMPLATE/EMAIL_REQUEST.md)<br>(copy the text between the `<!--` and `-->` characters)
- Check if the issue is a duplicate of an existing request or existing template. Watch [this demo](https://user-images.githubusercontent.com/221550/84061909-bb3bde80-a98c-11ea-8cc1-07bdb315abaf.gif) to see how. If the request is a duplicate, add the <kbd>duplicate</kbd> label and close the issue with a link to the earlier request.
- Once it looks ready for review, add the <kbd>content-ready-for-review</kbd> label and remove the <kbd>new-request</kbd> label.

## 3. Review team (non-technical)

This is where we need the most help. When emails are first written, they need to be fact-checked and lightly edited for typos.

- Find the oldest email that need review. Those will be in [issues](https://github.com/defund12/defund12.org/issues?q=is%3Aissue+is%3Aopen+label%3Anew-request) that have the `new-request` label.
- Try to make the email follow the [email style guidelines](/docs/email_style.md), trying to not change the author's intent or voice. Post the edited email as a new comment, and please write a summary of the things you changed.
- If you want a second opinion, leave a comment, and another reviewer should find the issue and can offer their thoughts. Or if it really requires discussion, ask on Discord.
- When you are satisfied with the email, add the <kbd>ready-for-pr</kbd> label and remove the <kbd>new-request</kbd> label. Someone on the Formatting Team will come and add the email to the website.

## 4. Formatting team (semi-technical)

This team takes emails that have been reviewed by the Review Team, formats them into code, and then submits a Pull Request (PR) to add the email to the website. It is semi-technical, requiring a basic understanding of GitHub, markdown, YAML, and coding style.

- Find the oldest [issue](https://github.com/defund12/defund12.org/issues?q=is%3Aissue+is%3Aopen+label%3Aready-for-pr) with the <kbd>ready-for-pr</kbd> label. Claim the issue in a comment or assign it to yourself so no one else begins working on it.
- Create a new `country/state/city.md` file in the `/_emails` directory. Ensure it follows the [formatting guidelines](/_emails/README.md).
- Submit a PR against the `master` branch of defund12.org. Only add or modify one email per PR. This make it easier to process the history of what's entering the codebase, and takes some strain off the reviewer.

## 5. Other (non-technical to technical)

There are plenty of other things that we could use your help with. This could be reviewing already submitted emails to ensure they are quality, writing code for the website, mentoring other volunteers, doing social media outreach, or something else. Introduce yourself on the [#general channel of our Discord](https://discord.gg/epwskWD) and we can find you something!
