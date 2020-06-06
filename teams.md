# Defund12.org Team Organization

NOTE: All work that people are doing to further defund12.org is important and helpful. However in order to keep things moving efficently, we have defined teams and responsibilities so that We can move forward together in an efficent manner.

The teams and responsibilities/definitions are closely related to how issue(email) creation, review, and site additions happen

## 1. User that submits issue

Anyone that would like to add an email for their locale. They create issue in adherence to [email guidelines](https://github.com/teddywilson/defund12.org/blob/gh-pages/EMAIL_TEMPLATE_STYLE_GUIDE.md).

## 2. Triage Team [Needs people!]

A person on the triage team is the first to review newly created issues.

**Responsibilities**

- Check if issue has all required data
  - Does it meet basic data requirements?
    - Subject line
    - Recipients
    - CC addresses
    - Body text
  - Does body text adhere to style guide?
    - Tag as ready to review. Add tag `[READY FOR REVIEW & APPROVAL]` and remove all previous tags

## 3. Review, Editing, and Approval Team [Needs people!]

Ensure the email roughly adheres to [email guidelines](https://github.com/teddywilson/defund12.org/blob/gh-pages/EMAIL_TEMPLATE_STYLE_GUIDE.md).

**Responsibilities**

- If body content is not salvageable, **close issue**.
- Is it _good enough_?
  - Does it have locale specific info?
  - Is the core statement in regards to defunding local police departments
  - Add tag `[READY FOR PR]` and remove all otehr tags
- Even though the issue is _good enough_ and you added the `[REEADY FOR PR]`, do you still think the email template needs work or editing?
  - Add tag `[EMAIL STILL NEEDS WORK]` and leave comment on what the outstanding tasks are .

## 4. Email Addition Development team

This team will pick up issues that have the `[Ready for PR]` tag. Issues should only be assigned to a developer for less 24 hrs to ensure emails get added to the site quickly.

**Responsibilities**

- Assign issue to yourself so no other developer begins working on it
- Create a PR for the email issue
- Ensure the email markdown is correct and properly linted.
- Once done, add tag `[READY FOR CODE REVIEW]` and remove all other tags

## Join the conversation

If you'd like to help out, please join our discord [here](https://discord.gg/YMxndzd) and say hello. We'd love your help!
