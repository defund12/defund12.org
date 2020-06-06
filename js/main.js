/* eslint no-unused-vars: "warn"*/
//function formatEmailList() {
//    const list = $("#emailLinks");
//    const countryList = $("#selected_country");
//    const stateList = $("#selected_state");
//  if (list.length) {
//    let content = $("<div></div>");
//    const items = list.find("li");
//    const countries = {};
//    for (let item of items) {
//      // Setup click event
//      // $(item).on('click', () => {
//      // 	const { recipients, subject, body } = item.dataset;
//      // 	location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
//      // })

//      // Push into state lists
//      const { state, country } = item.dataset;
//      if (countries[country] === undefined) {
//          countries[country] = [];
//          const countryElement = $(`<option value="${country}">${country}</option>`);
//          countryList.append(countryElement);
//      }
//      const currentCountry = countries[country];
//      if (currentCountry[state] === undefined) {
//          currentCountry[state] = [];
//          const stateElement = $(`<option hidden data-country="${country}" value="${state}">${state}</option>`);
//          stateList.append(stateElement);
//      }
//      currentCountry[state].push(item);
//    }
//    for (let [countryCode, states] of Object.entries(countries)) {
//      let countryElement = $(`<div class='country' data-country="${countryCode}"></div>`);
//      countryElement.append(`<h1>${countryCode}</h1>`);
//      for (let [name, items] of Object.entries(states)) {
//        let stateElement = $(`<div class='state' data-country="${countryCode}" data-state="${name}"></div>`);
//        stateElement.append(`<h2>${name}</h2>`);
//        for (let item of items) stateElement.append(item);
//        countryElement.append(stateElement);
//      }
//      content.append(countryElement);
//    }
//    list.html(content);
//  }
//}

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

function selectCountry(event) {
    $("#selected_state option").each(function () {
        if ($(this).data('country') === event.target.value) {
            $(this).removeAttr('hidden');
        } else {
            $(this).attr('hidden', true);
        }
    });
    $(`#emailLinks .country[data-country!="${event.target.value}"]`).attr('hidden', true);
    $(`#emailLinks .country[data-country="${event.target.value}"]`).removeAttr('hidden');
    $(`#emailLinks .state`).removeAttr('hidden');
    $("#selected_state").val("Region");
}

function selectState(event) {
    $(`#emailLinks .state[data-state!="${event.target.value}"]`).attr('hidden', true);
    $(`#emailLinks .state[data-state="${event.target.value}"]`).removeAttr('hidden');
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
