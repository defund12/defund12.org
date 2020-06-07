#!/bin/bash
#
# Executes defund12.org unit tests

# Root level directory
GIT_ROOT="$(git rev-parse --show-toplevel)"

# Run Mocha js tests
"${GIT_ROOT}/node_modules/mocha/bin/mocha"
