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
        let key_val = item[1].toLowerCase().replace(' ', '-')
        if(key_val in templating){
            templating[key_val].location.push(item.index)
        }
        else {
            templating[key_val] = {
                location: [item.index],
                repl_text: item[0]
            }
        }
    })

    // wrap templated regions in spans
    for(key in templating){
        $('.body').html(function(_, html){
            let reg_search_str = templating[key].repl_text.replace('[', '\\[').replace(']', '\\]')
            return html.replace(
                new RegExp(reg_search_str, 'g'),
                `<span class="template-region" data-templatekey="${key}">${templating[key].repl_text}</span>`
                )
        })
    }
}

function renderTemplatingForm(){
    let html_hook = $('.template-fill')
    for(key in templating){
        let key_pretty = key.replace('-', ' ')
        let entry_html = `
            <div class="template-entry">
                <label for="${key}">${key_pretty}</label>
                <input type="text" name="${key}" id="${key}-input">
            </div>
        `
        html_hook.append(entry_html)
    }

    $('.template-fill :input').each(function(){
        $(this).on('input', function(){
            $(`span[data-templatekey="${this.name}"]`).text($(this).val())
        })
    })

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