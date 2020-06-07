/* eslint no-unused-vars: "warn"*/

/**
 * Formats the main list of emails
 */
function formatEmailList() {
  const list = $('#emailLinks');
  const stateList = $('#selected_state');
  if (list.length) {
    const content = $('<div></div>');
    const items = list.find('li');
    const locales = {};
    for (const item of items) {
      const {state} = item.dataset;
      if (locales[state] === undefined) {
        locales[state] = [];
        const stateElement = $(`<option value="${state}">${state}</option>`);
        stateList.append(stateElement);
      }
      locales[state].push(item);
    }
    for (const [state, items] of Object.entries(locales)) {
      const stateElement = $(`<div class='state' data-state="${state}"></div>`);
      stateElement.append(`<h2>${state}</h2>`);
      for (const item of items) stateElement.append(item);
      content.append(stateElement);
    }
    list.html(content);

    stateList.selectBox();
  }
}

// Most recent span element used in copyToClipboard
let mostRecentSpanElement;

/**
 * Copys text to clipboard
 * @param {DOMElement} spanElement Span element with copy to clipboard icon
 * @param {Text} copyText Text to copy
 * @param {Boolean} isPermalink True if the copied text is a permalink
 */
function copyToClipboard(spanElement, copyText, isPermalink) {
  if (mostRecentSpanElement) {
    mostRecentSpanElement.innerHTML = '🔗';
  }

  spanElement.innerHTML = '✅(copied)';
  mostRecentSpanElement = spanElement;

  const element = document.createElement('textarea');
  let copyValue = copyText;
  if (isPermalink) {
    copyValue = 'https://defund12.org'.concat(copyText);
  }
  element.value = copyValue;
  document.body.appendChild(element);
  element.select();
  document.execCommand('copy');
  document.body.removeChild(element);
}

/**
 * Called when the user selects a state from the dropdown menu
 * @param  {Event} event The DOM on change event object
 */
function selectState(event) {
  const matchingStates = $(
      `#emailLinks .state[data-state="${event.target.value}"]`);
  if (matchingStates.length === 0) {
    $(`#emailLinks .state`).removeAttr('hidden');
  } else {
    $(`#emailLinks .state[data-state!="${event.target.value}"]`)
        .attr('hidden', true);
    matchingStates.removeAttr('hidden');
  }
}

/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
const getParams = function(url) {
  const params = {};
  const parser = document.createElement('a');
  parser.href = url;
  const query = parser.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

$(document).ready(() => {
  formatEmailList();
});
