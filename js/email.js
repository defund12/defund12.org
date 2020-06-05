var templating = {}

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

function parseEmailBody(){
    // populates templating object with all bracketed statements as keys
    let regexp = /\[(.*?)\]/gm
    let match_array = [...email.body.matchAll(regexp)]

    match_array.forEach(function(item){
        if(item[1] in templating){
            templating[item[1]].location.push(item.index)
        }
        else {
            templating[item[1]] = {
                location: [item.index],
                repl_text: item[0]
            }
        }
    })

    // wrap templated regions in spans
    for(key in templating){
        $(`.body:contains('${key}')`).html(function(_, html){
            return html.replace(
                `${templating[key].repl_text}`,
                `<span class="template-region" data-templatekey="${key}">${templating[key].repl_text}</span>`
                )
        })
    }
}

function renderTemplatingForm(){
    let html_hook = $('.template-fill')

}

function renderRecipientsList(){
    let html_hook = $('#recipients-list')
    email.recipients.forEach(function (item){
        html_hook.append(`<span class='recipient'>${item} </span>`)
    })

    if('cc' in email){
        let cc_hook = $('#cc-list')
        email.cc.forEach(function (item){
            cc_hook.append(`<span class='recipient'>${item} </span>`)
        })
    }
}

function renderEmail(){
    renderRecipientsList()
    parseEmailBody()
    renderTemplatingForm()
}