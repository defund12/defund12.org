# Defund12.org Team Organization

## 1. User that submits issue

Anyone who would like to add an email for their locale creates issue in adherence to the [email guidelines](https://github.com/teddywilson/defund12.org/blob/gh-pages/EMAIL_TEMPLATE_STYLE_GUIDE.md).

## 2. Triage Team

A person on the triage team is the first to review newly created issues. Look over all issues that have the tag <kbd>new-request</kbd>

### Responsibilities

#### Check for duplicates
- Check if the issue is a duplicate of an existing request or existing template. In the Issues tab, search for the requested locale with `is:open is:closed [LOCALE]` to see if an open request or merged template already exists.
![](https://user-images.githubusercontent.com/221550/84061909-bb3bde80-a98c-11ea-8cc1-07bdb315abaf.gif)
- If the request is a duplicate, add the <kbd>duplicate</kbd> tag and close the issue with a link to the earlier request

#### Check for completion
- Check if issue has all required data
  - Does it meet basic data requirements?
    - Recipients (CC addresses)
    - Body text
  - If not, **close issue** and reply with the contents of the [email request template](https://raw.githubusercontent.com/defund12/defund12.org/gh-pages/.github/ISSUE_TEMPLATE/EMAIL_REQUEST.md)<br>(copy the text between the `<!--` and `-->` characters)
  - If yes, tag as ready to review. Add tag <kbd>content-ready-for-review</kbd> and remove all previous tags

## 3. Review, Editing, and Approval Team [Needs people!]

Ensure the email roughly adheres to [email guidelines](https://github.com/teddywilson/defund12.org/blob/gh-pages/EMAIL_TEMPLATE_STYLE_GUIDE.md).

### Responsibilities

- If body content is not salvageable, **close issue**.
- Is it _good enough_?
  - Does it have locale specific info?
  - Is the core statement in regards to defunding local police departments
  - Add tag <kbd>ready-for-pr</kbd> and remove all other tags
- Even though the issue is _good enough_ and you added the <kbd>ready-for-pr</kbd>, do you still think the email template needs work or editing?
  - Add tag <kbd>email-needs-work</kbd> and leave comment on what the outstanding tasks are.

## 4. Email Addition Development Team

This team will pick up issues that have the <kbd>ready-for-pr</kbd> tag. Issues should only be assigned to a developer for less 24 hrs to ensure emails get added to the site quickly.

### Responsibilities

- Assign issue to yourself so no other developer begins working on it
- Create a PR for the email issue
- Ensure the email markdown is correct and properly linted.
- Once PR is up, someone will review and merge!

### Conventions to follow

- Please use the following file name convention: `[state]-[city].md`

## Join the conversation

If you'd like to help out, please join our Discord [here](https://discord.gg/YMxndzd) and say hello. We'd love your help!

We have created channels in the Discord channel that correspond to each team. These will be used for team specific communication and organization. Whichever team you'd like to join, please join the Discord appropriate channel and say hello.
