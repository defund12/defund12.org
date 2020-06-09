#  Markdown tests

## Build the Docker image
`docker build . -t markdown-tests`

## Run it
```
cd $(git rev-parse --show-toplevel)
docker run \
  -v "$PWD/_emails:/email_markdown_files" \
  -it markdown-tests
```
