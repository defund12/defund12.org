import io
import os
import sys
import yaml

ROOT_DIR = '/email_markdown_files/us'

ALLOWLISTED_KEYS = [
  'title',
  'permalink',
  'name',
  'state',
  'city',
  'layout',
  'recipients',
  'subject',
  'body'
]


def validate_document_has_allowlisted_keys(doc, filepath):
  for allowlisted_key in ALLOWLISTED_KEYS:
    if allowlisted_key not in doc:
      print('allowlisted_key key %s not found in file %s' % (allowlisted_key, filepath))
      sys.exit(1)

def test_files_contain_allowlisted_keys():
  print('test_files_contain_allowlisted_keys()')
  for subdir, dirs, files in os.walk(ROOT_DIR):
    for file in files:
      if file.endswith('.md'):
        filepath = os.path.join(subdir, file)
        with open(filepath, 'r') as stream:
          docs = yaml.load_all(stream)
          for doc in docs:
            if doc is None:
                continue
            validate_document_has_allowlisted_keys(doc, filepath)

def main():
  print('Running markdown file tests...')

  test_files_contain_allowlisted_keys()

  print('All tests pass!')
  sys.exit(0)

if __name__ == "__main__":
    main()
