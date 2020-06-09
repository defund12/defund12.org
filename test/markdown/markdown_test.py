import io
import numpy as np
import os
import sys
import yaml

from pathlib import Path

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

def success(test_name):
  print('✅' + ' ' + test_name)

def fail(error_message):
  print('❌' + ' ' + error_message)
  sys.exit(1)

def test_files_exist():
  files = [file for file in Path(ROOT_DIR).rglob('*.md')] 
  _, counts = np.unique([file.parent for file in files ], return_counts=True)
  if counts.sum() == 0:
    fail('test received no files at at path %s' % ROOT_DIR)

def validate_document_has_allowlisted_keys(doc, filepath):
  for allowlisted_key in ALLOWLISTED_KEYS:
    if allowlisted_key not in doc:
      fail('allowlisted_key key %s not found in file %s' % (allowlisted_key, filepath))

def get_markdown_files():
  markdown_files = []
  for subdir, dirs, files in os.walk(ROOT_DIR):
    for file in files:
      if file.endswith('.md'):
        markdown_files.append(os.path.join(subdir, file))
  return markdown_files      

def test_files_contain_allowlisted_keys():
  for filepath in get_markdown_files():
    with open(filepath, 'r') as stream:
      docs = yaml.load_all(stream)
      for doc in docs:
        if doc is None:
            continue
        validate_document_has_allowlisted_keys(doc, filepath)

def test_files_contain_allowlisted_keys():
  for filepath in get_markdown_files():
    with open(filepath, 'r') as stream:
      docs = yaml.load_all(stream)
      for doc in filter(None, docs):
        validate_document_has_allowlisted_keys(doc, filepath)

def test_files_contain_unique_permalinks():
  permalinks = []
  filepaths = []
  for filepath in get_markdown_files():
    with open(filepath, 'r') as stream:
      docs = yaml.load_all(stream)
      for doc in filter(None, docs):
        permalink = doc['permalink']
        if permalink in permalinks:
          index = permalinks.index(permalink)
          fail('permalink %s in file %s already exists in file %s' % (permalink, filepath, filepaths[index]))
        permalinks.append(permalink)
        filepaths.append(filepath)

def main():
  print('Running markdown file tests...')

  test_files_exist()
  success('test_files_exist')

  test_files_contain_allowlisted_keys()
  success('test_files_contain_allowlisted_keys')

  test_files_contain_unique_permalinks()
  success ('test_files_contain_unique_permalinks')

  print('All tests pass!')
  sys.exit(0)

if __name__ == "__main__":
    main()
