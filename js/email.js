function openSystemEmailClient(){
	const subject = encodeURIComponent(`{{ page.subject }}`.trim());
	const body = encodeURIComponent(`{{ page.body }}`.trim());
	const recipients = `{{ page.recipients | join: ',' }}`;
	const cc = `{{ page.cc | join: ',' }}`;
	const ccText = cc !== null && cc.length > 0 ? `cc=${cc}&` : ``;
	location.href = `mailto:${recipients}?${ccText}subject=${subject}&body=${body}`;
}

function openWebGmailClient(){

}

function renderTemplatingForm(){
    let html_hook = $('.template-fill')

}

function renderRecipientsList(){
    let html_hook = $('#recipients-list')
    console.log(email.recipients)
    email.recipients.forEach(function (item, idx){
        html_hook.append(`<span class='recipient'>${item} </span>`)
    })
}

function renderEmail(){
    renderRecipientsList()
}