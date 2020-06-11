# Notice for template implementers

When adding templates, please ensure you are using UTF-8 encoding. Please do not use UTF-8-BOM or "ANSI", as this may cause problems when rendering the template.

## Fields

| Key             | Required | Type   | Description                                                                         |
| --------------- | -------- | ------ | ----------------------------------------------------------------------------------- |
| title           | yes      | String | City, State (for CMS tracking purposes)                                             |
| layout          | yes      | String | Layout for markdown file (must be `email`)                                          |
| permalink       | yes      | String | Path to url on the site (e.g., /nyc                                                 |
| name            | yes      | String | Name of the email that will be displayed to users                                   |
| city            | yes      | String | City the email template is for                                                      |
| state           | yes      | String | State (abbreviated) the email template is for (e.g., NY)                            |
| recipients      | yes      | Array  | Array of email addresses the email will be directly sent to                         |
| subject         | yes      | String | Subject body for the email, even though this is currently replaced by a default     |
| body            | yes      | String | Body text for the email. Prefix with `|-` and indent underneath (e.g., see below)   |
| cc              | no       | Array  | Array of email addresses the email will be cc-ed to                                 |
| expiration_date | no       | String | YYYY-MM-DD format date that email should expire from the site                       |
| organization    | no       | String | Name of the organization that curated the email template (if it exists)             |
| redirect_from   | no       | Array  | Links that should redirect to the permalink above                                   |

## File naming conventions

Please use spaces when creating new markdown files and directories. For example:

```
_emails/us/california/san_francisco.md
_emails/us/new_york/hudson_valley.md
```

## Example template

```
---
title: <city, state_initials>
layout: email
permalink: "/<link_address>"
name: <name>
city: <city>
state: <state_initials>
recipients:
- <recipient>
- <recipient>
subject: <subject>
body: |-
  <body>
cc:
- <recipient>
- <recipient>  
expiration_date: <YYYY-MM-DD>
organization: <organization>  
redirect_from:
- "/<redirect_link_address>"  
---
```
