#!/usr/bin/python
# -*- coding: UTF-8 -*-
import io
import numpy as np
import os
import re
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
  'body': str
}

ALLOWLISTED_KEYS_OPTIONAL = {
  'cc': list,
  'expiration_date': str,
  'organization': str,
  'redirection_from': list,
  'subject': str
}


def success(test_name):
  """Prints success result for a test name"""
  print('✅' + ' ' + test_name)


def fail(error_message):
  """Fails test runner with a given error message"""
  print('❌' + ' ' + error_message)
  sys.exit(1)


def run_test(test):
  """Executes a test and prints out a success message if it passes"""
  test()
  success(test.__name__)  


def run_tests(tests):
  """Executes an array of tests"""
  for test in tests:
    run_test(test)


def get_markdown_files():
  """Fetches all markdown files recursively in the ${ROOT_DIR}"""
  markdown_files = []
  for subdir, dirs, files in os.walk(ROOT_DIR):
    for file in files:
      if file.endswith('.md'):
        markdown_files.append(os.path.join(subdir, file))
  return markdown_files      


def test_files_exist():
  """Tests that at least one markdown file exists in ${ROOT_DIR}"""
  files = [file for file in Path(ROOT_DIR).rglob('*.md')] 
  _, counts = np.unique([file.parent for file in files ], return_counts=True)
  if counts.sum() == 0:
    fail('test received no files at at path %s' % ROOT_DIR)


def test_file_names_are_valid():
  """"Tests that all markdown files have valid filenames""""
  for filepath in get_markdown_files():
    filename = os.path.basename(filepath).rsplit( ".", 1)[0]
    if not re.match("^[a-z_]*$", filename):
      fail('%s must only contain lowercase and underscore characters' % filepath)


def test_layout_is_email():
  """Tests that all 'layout' attributes are set to 'email'"""
  for filepath in get_markdown_files():
    with open(filepath, 'r') as stream:
      docs = yaml.safe_load_all(stream)
      for doc in filter(None, docs):
        if 'layout' not in doc:
          fail('%s must contain \'layout\' field' % filepath)
        elif doc['layout'] != 'email':
          fail('\'layout\' field in %s must be \'email\'' % filepath)  


def validate_document_has_allowlisted_keys(doc, filepath):
  """Validates that a document contains all of the necessary keys and correct corresponding types"""
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
        filepath, key, type(doc[key]), ALLOWLISTED_KEYS_OPTIONAL[key]))


def test_files_contain_allowlisted_keys():
  """Tests that all markdown files contain required keys and corresponding types"""
  for filepath in get_markdown_files():
    with open(filepath, 'r') as stream:
      docs = yaml.safe_load_all(stream)
      for doc in filter(None, docs):
        validate_document_has_allowlisted_keys(doc, filepath)


def test_files_contain_unique_permalinks():
  """Tests that all permalink attributes are unique across the whole test directory"""
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


def test_files_contain_unique_redirects():
  """Tests that all redirect_from attributes are unique across the whole test directory"""
  redirects = []
  filepaths = []
  for filepath in get_markdown_files():
    with open(filepath, 'r') as stream:
      docs = yaml.safe_load_all(stream)
      for doc in filter(None, docs):
        if 'redirect_from' not in doc:
          continue
        doc_redirects = doc['redirect_from']
        for redirect in doc_redirects:
          if redirect in redirects:
            index = redirects.index(redirect)
            fail('redirect %s in file %s already exists in file %s' % (
              redirect, filepath, filepaths[index]))
          redirects.append(redirect)
          filepaths.append(filepath)    


def test_permalinks_are_valid():
  """Tests that all permalinks are of the proper format"""
  for filepath in get_markdown_files():
    with open(filepath, 'r') as stream:
      docs = yaml.safe_load_all(stream)
      for doc in filter(None, docs):
        if 'permalink' not in doc:
          fail('%s must contain \'permalink\' field' % filepath)
        permalink = doc['permalink']
        if not permalink[0] == '/':
          fail('%s permalink %s must start with backslash' % (filepath, permalink))
        elif not re.match("^[a-z-]*$", permalink[1:]):
          fail('%s permalink %s must only contain lowercase and hyphen characters' % (filepath, permalink))


def main():
  print('🔨 Running markdown file tests...')

  run_tests([
    test_files_exist,
    test_file_names_are_valid,
    test_layout_is_email,
    test_files_contain_allowlisted_keys,
    test_files_contain_unique_permalinks,
    test_files_contain_unique_redirects,
    test_permalinks_are_valid
  ])

  print('😇 All tests pass!')
  sys.exit(0)

if __name__ == "__main__":
    main()