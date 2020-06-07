/* eslint no-unused-vars: "warn"*/

/**
 * Formats the main list of emails
 */
function formatEmailList() {
  const list = $('#emailLinks');
  if (list.length) {
    const content = $('<div></div>');
    const items = list.find('li');
    const states = {};
    for (const item of items) {
      const {state} = item.dataset;
      if (states[state] === undefined) {
        states[state] = [];
      }
      states[state].push(item);
    }
    for (const [name, items] of Object.entries(states)) {
      const stateElement = $('<div class=\'state\'></div>');
      stateElement.append(`<h2>${name}</h2>`);
      for (const item of items) stateElement.append(item);
      content.append(stateElement);
    }
    list.html(content);
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
