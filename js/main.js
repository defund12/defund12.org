
function formatEmailList() {
	const list = $("#emailLinks")
	if (list.length) {
		let content = $("<div></div>");
		const items = list.find('li')
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
			let stateElement = $("<div class='state'></div>")
			stateElement.append(`<h2>${name}</h2>`)
			for (let item of items) stateElement.append(item)
			content.append(stateElement)
		}
		list.html(content)
	}
}

var mostRecentSpanElement;
function copyToClipboard(spanElement, copyText) {
	if (mostRecentSpanElement) {
		mostRecentSpanElement.innerHTML = "🔗";
	}

	spanElement.innerHTML = "✅(copied)";
	mostRecentSpanElement = spanElement;

	const element = document.createElement('textarea');
	let copyValue = 'https://defund12.org'.concat(copyText)
	element.value = copyValue;
	document.body.appendChild(element);
	element.select();
	document.execCommand('copy');
	document.body.removeChild(element);
}

$(document).ready(() => {
	formatEmailList()
})