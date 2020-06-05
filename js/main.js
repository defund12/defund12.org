function formatEmailList() {
  const list = $("#emailLinks");
  if (list.length) {
    let content = $("<div></div>");
    const items = list.find("li");
    const states = {};
    for (let item of items) {
      // Setup click event
      // $(item).on('click', () => {
      // 	const { recipients, subject, body } = item.dataset;
      // 	location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
      // })

      // Push into state lists
      const { state } = item.dataset;
      if (states[state] === undefined) {
        states[state] = [];
      }
      states[state].push(item);
    }
    for (let [name, items] of Object.entries(states)) {
      let stateElement = $("<div class='state'></div>");
      stateElement.append(`<h2>${name}</h2>`);
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
