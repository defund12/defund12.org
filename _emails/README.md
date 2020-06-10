# Email Formatting

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

## Examples

Here is an example of a bad email `.md` file:
```
title: Manchester, New Hampshire
permalink: "/manchesternh"
name: BLM: Letter to the Mayor
state: NH
city: Manchester
layout: email
recipients:
- mayor@manchesternh.gov
- kcavanaugh@manchesternh.gov
- wstewart@manchesternh.gov
subject: Reduce the Manchester Police Department Budget
body: |
  Hi, my name is [NAME] and I am a resident of [NEIGHBORHOOD]. I am asking to redirect money away from the Huntsville PD and into the following social services: [LIST - Community Development, COVID Relief, Education, Parks & Recreation]. I request that an emergency meeting be called before the fiscal year goes into effect in order to deny the mayor's proposed budget and reallocate these funds to resources from which the citizens can benefit.
  Thank you for your time,
  [YOUR NAME]
  [YOUR ADDRESS]
  [YOUR EMAIL]
  [YOUR PHONE NUMBER]
cc:
- bshaw@manchesternh.gov
- bbarry@manchesternh.gov
expiration_date: "2020-07-01"
organization: "BLM Manchester"  
redirect_from:
- /manchester-nh
```
and here is an example of a good one:
```
---
title: "Manchester, New Hampshire"
permalink: "/manchesternh"
name: "BLM: Letter to the Mayor"
state: "NH"
city: "Manchester"
layout: "email"
recipients:
- "mayor@manchesternh.gov"
- "kcavanaugh@manchesternh.gov"
- "wstewart@manchesternh.gov"
subject: "Reduce the Manchester Police Department Budget"
body: |-
  Hi, my name is [NAME] and I am a resident of [NEIGHBORHOOD]. I am asking to redirect money away from the Huntsville PD and into the following social services: [LIST - Community Development, COVID Relief, Education, Parks & Recreation]. I request that an emergency meeting be called before the fiscal year goes into effect in order to deny the mayor's proposed budget and reallocate these funds to resources from which the citizens can benefit.

  Thank you for your time,

  [YOUR NAME]

  [YOUR ADDRESS]

  [YOUR EMAIL]

  [YOUR PHONE NUMBER]
cc:
  - "bshaw@manchesternh.gov"
  - "bbarry@manchesternh.gov"
  expiration_date: "2020-07-01"
  organization: "BLM Manchester"  
  redirect_from:
  - "/manchester-nh"
---
```
In the good one:
- All lines within `body` are indented two spaces.
- The `body` field begins with `|-`. If you want see [what that does](https://yaml-multiline.info/).
- All fields besides the `body` should be in quotes. Notice the `name` field has a `:` inside of it, and the `redirect_from` field has a `-`. Those needs to be in quotes or they mess up the YAML parser. Sometimes the value is fine, but to be consistent we ask that they always be in quotes.
- The file begins and ends with lines containing `---`. That is how [the website builder](https://jekyllrb.com/docs/front-matter/) knows that this section contains metadata in YAML.
- All lines that you want separate are separated by a blank line. Otherwise consecutive lines are run together in the same paragraph. Kinda weird and dumb, but it's what we have working.
