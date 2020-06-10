#!/usr/bin/python
# -*- coding: UTF-8 -*-
import io
import numpy as np
import os
import sys
import yaml

from pathlib import Path

ROOT_DIR = os.environ.get('DEFUND12_EMAIL_DIR')
if ROOT_DIR is None:
  print('$DEFUND12_EMAIL_DIR is not set')
  sys.exit(1)

ALLOWLISTED_KEYS_REQUIRED = {
  'title': str,
  'permalink': str,
  'name': str,
  'state': str,
  'city': str,
  'layout': str,
  'recipients': list,
  'subject': str,
  'body': str
}

ALLOWLISTED_KEYS_OPTIONAL = {
  'cc': list,
  'expiration_date': str,
  'organization': str,
  'redirection_from': list
}

def success(test_name):
  print('✅' + ' ' + test_name)

def fail(error_message):
  print('❌' + ' ' + error_message)
  #sys.exit(1)

def test_files_exist():
  files = [file for file in Path(ROOT_DIR).rglob('*.md')] 
  _, counts = np.unique([file.parent for file in files ], return_counts=True)
  if counts.sum() == 0:
    fail('test received no files at at path %s' % ROOT_DIR)

def validate_document_has_allowlisted_keys(doc, filepath):
  required_keys_not_found = []
  invalid_types = []

  for key in ALLOWLISTED_KEYS_REQUIRED:
    if key not in doc:
      required_keys_not_found.append(key)
    elif not isinstance(doc[key], ALLOWLISTED_KEYS_REQUIRED[key]):
      fail('in file %s required key %s has invalid type %s should be %s' % (
        filepath, key, type(doc[key]), ALLOWLISTED_KEYS_REQUIRED[key]))
      
  if required_keys_not_found:
    prefixed_required_keys_not_found = ["🔑 ~> " + key for key in required_keys_not_found] 
    fail('in file %s required keys not found:\n%s' % (
      filepath, "\n".join(prefixed_required_keys_not_found)))

  for key in ALLOWLISTED_KEYS_OPTIONAL:
    if key not in doc:
      continue
    elif not isinstance(doc[key], ALLOWLISTED_KEYS_OPTIONAL[key]):
      fail('in file %s optional key %s has invalid type %s should be %s' % (
        filepath, key, type(doc[key], ALLOWLISTED_KEYS_OPTIONAL[key])))


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
      docs = yaml.safe_load_all(stream)
      for doc in docs:
        if doc is None:
            continue
        validate_document_has_allowlisted_keys(doc, filepath)

def test_files_contain_allowlisted_keys():
  for filepath in get_markdown_files():
    with open(filepath, 'r') as stream:
      docs = yaml.safe_load_all(stream)
      for doc in filter(None, docs):
        validate_document_has_allowlisted_keys(doc, filepath)

def test_files_contain_unique_permalinks():
  permalinks = []
  filepaths = []
  for filepath in get_markdown_files():
    with open(filepath, 'r') as stream:
      docs = yaml.safe_load_all(stream)
      for doc in filter(None, docs):
        permalink = doc['permalink']
        if permalink in permalinks:
          index = permalinks.index(permalink)
          fail('permalink %s in file %s already exists in file %s' % (
            permalink, filepath, filepaths[index]))
        permalinks.append(permalink)
        filepaths.append(filepath)

def main():
  print('🔨 Running markdown file tests...')

  test_files_exist()
  success('test_files_exist')

  test_files_contain_allowlisted_keys()
  success('test_files_contain_allowlisted_keys')

  test_files_contain_unique_permalinks()
  success('test_files_contain_unique_permalinks')

  print('😇 All tests pass!')
  sys.exit(0)

if __name__ == "__main__":
    main()
