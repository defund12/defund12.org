# Notice for template implementers

When adding templates, please ensure you are using UTF-8 encoding. Please do not use UTF-8-BOM or "ANSI", as this may cause problems when rendering the template.

## Fields

### Call Script
| Key             | Required | Type   | Description                                                                               |
| --------------- | -------- | ------ | ----------------------------------------------------------------------------------------- |
| title           | yes      | String | City, State (for CMS tracking purposes)                                                   |
| layout          | yes      | String | Layout for markdown file (must be `phone`)                                                |
| permalink       | yes      | String | Path to url on the site (e.g., /nyc)                                                      |
| name            | yes      | String | Name of the call script that will be displayed to users                                   |
| city            | yes      | String | City the call script is for                                                               |
| state           | yes      | String | State (abbreviated) the call script is for (e.g., NY)                                     |
| body            | yes      | String | The call script text. Prefix with `|-` and indent underneath (e.g., see below)            |
| contacts        | yes      | Array  | Contact information for officials to call with this script using the Contact fields below |
| expiration_date | no       | String | YYYY-MM-DD format date that the call script should expire from the site                   |
| organization    | no       | String | Name of the organization that curated the call script (if it exists)                      |
| redirect_from   | no       | Array  | Links that should redirect to the permalink above                                         |

### Contact
| Key    | Required | Type   | Description                                                           |
| ------ | -------- | ------ | --------------------------------------------------------------------- |
| name   | yes      | String | The official's name including title, e.g. Board Supervisor First Last |
| number | yes      | String | The official's phone number, formatted like e.g. (555) 555-5555       |

## File naming conventions

Please use underscores for spaces when creating new markdown files and directories. For example:

```
_phone/us/california/san_francisco.md
_phone/us/new_york/hudson_valley.md
```

## Example template

```
---
title: <city, state_initials>
layout: phone
permalink: /<link_address>
name: <name>
city: <city>
state: <state_initials>
contacts:
- name: <name>
  number: <phone number>
- name: <name>
  number: <phone number>
body: |-
  <body>
expiration_date: <YYYY-MM-DD>
organization: <organization>  
redirect_from:
- /<redirect_link_address>
---
```
