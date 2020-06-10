#  Markdown tests

## Using Docker

### Build the Docker image
`docker build . -t markdown-tests`

### Run it
```
cd $(git rev-parse --show-toplevel)
docker run \
  -v "$PWD/_emails:/email_markdown_files" \
  -it markdown-tests
```

## Running locally

1. Set environment variable `DEFUND12_EMAIL_DIR` to the path to your Defund12.org repo location, plus `_emails/us`
2. Install `pip` libraries listed in requirements.txt
3. From the Defund12.org repo location, run `python ./test/markdown/markdown_test.py`