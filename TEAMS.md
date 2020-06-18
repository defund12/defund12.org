# Defund12.org Team Organization

## 1. User that submits issue
Anyone who would like to add an email for their locale creates an issue in adherence to the [email guidelines](EMAIL_TEMPLATE_STYLE_GUIDE.md).

## 2. Triage Team
First to review newly created issues. Look over all issues with <kbd>new-request</kbd> label.

### Responsibilities

#### Check for duplicates
- Check if the issue is a duplicate of an existing request or existing template. In the Issues tab, search for the requested locale with `is:open is:closed [LOCALE]` to see if an open request or merged template already exists.
![](https://user-images.githubusercontent.com/221550/84061909-bb3bde80-a98c-11ea-8cc1-07bdb315abaf.gif)
- If the request is a duplicate, add the <kbd>duplicate</kbd> label and close the issue with a link to the earlier request

#### Check for completion
- Check if issue has all required data
  - Does it meet basic data requirements?
    - Recipients (CC addresses)
    - Body text
  - If not, **close issue** and reply with the body of the [email request template](https://raw.githubusercontent.com/defund12/defund12.org/master/.github/ISSUE_TEMPLATE/EMAIL_REQUEST.md)
  - If yes, add <kbd>content-ready-for-review</kbd> label and remove all other labels

## 3. Review, Editing, and Approval Team [Needs people!]
Ensure the email roughly adheres to [email guidelines](/EMAIL_TEMPLATE_STYLE_GUIDE.md).

### Responsibilities

- If body content is not salvageable, **close issue**.
- Is it _good enough_?
  - Does it have locale specific info?
  - Is the core statement in regards to defunding local police departments
  - Add <kbd>ready-for-pr</kbd> label and remove all other labels
- Even though the issue is _good enough_ and you added the <kbd>ready-for-pr</kbd> label, do you still think the email template needs work or editing?
  - Add <kbd>email-needs-work</kbd> label and leave comment with the outstanding tasks.

## 4. Email Addition Development Team
Pick up issues with the <kbd>ready-for-pr</kbd> label. Issues should only be assigned to a developer for ≤24 hours to ensure emails get added to the site quickly.

### Responsibilities

- Assign issue to yourself so no other developer begins working on it
- Create a PR for the email issue
- Ensure the email markdown is correct and properly linted.
- Once PR is up, someone will review and merge!

### Conventions to follow

- Please refer to the [Emails README](_emails/README.md) with more information about email template conventions.

## Join the conversation

If you'd like to help out, please [join our Discord](https://discord.gg/YMxndzd) server. We’d love your help!

We have created channels in the Discord channel that correspond to each team. These will be used for team-specific communication and organization. Whichever team you'd like to join, please join the Discord appropriate channel and say hello.
