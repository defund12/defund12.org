function formatEmailList() {
  const list = $("#emailLinks");
  const stateList = $("#selected_state");
  if (list.length) {
    let content = $("<div></div>");
    const items = list.find("li");
    const locales = {};
    for (let item of items) {
      const { state } = item.dataset;
      if (locales[state] === undefined) {
        locales[state] = [];
        const stateElement = $(`<option value="${state}">${state}</option>`);
        stateList.append(stateElement);
      }
      locales[state].push(item);
    }
    for (let [state, items] of Object.entries(locales)) {
      let stateElement = $(`<div class='state' data-state="${state}"></div>`);
      stateElement.append(`<h2>${state}</h2>`);
      for (let item of items) stateElement.append(item);
      content.append(stateElement);
    }
    list.html(content);
  }
}

var mostRecentSpanElement;
function copyToClipboard(spanElement, copyText, isPermalink) {
  if (mostRecentSpanElement) {
    mostRecentSpanElement.innerHTML = "🔗";
  }

  spanElement.innerHTML = "✅(copied)";
  mostRecentSpanElement = spanElement;

  const element = document.createElement("textarea");
  let copyValue = copyText;
  if (isPermalink) {
    copyValue = "https://defund12.org".concat(copyText);
  }
  element.value = copyValue;
  document.body.appendChild(element);
  element.select();
  document.execCommand("copy");
  document.body.removeChild(element);
}

function selectState(event) {
    const matchingStates = $(`#emailLinks .state[data-state="${event.target.value}"]`);
    if (matchingStates.length === 0) {
        $(`#emailLinks .state`).removeAttr('hidden');
    } else {
        $(`#emailLinks .state[data-state!="${event.target.value}"]`).attr('hidden', true);
        matchingStates.removeAttr('hidden');
    }
}

/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};

$(document).ready(() => {
  formatEmailList();
});
