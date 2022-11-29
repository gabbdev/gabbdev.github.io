const urlParams = new URLSearchParams(window.location.search)
const ids = urlParams.get('id').split(',')
const conv = new showdown.Converter({simplifiedAutoLink: true,simpleLineBreaks: true,strikethrough: true})

window.onload = async ()=> {
    if (!ids) return alert('Erro')
    for (const msgId of ids) {
        let request = await fetch('https://il0.cc/api/dfsbot/journal?id=' + msgId)
        request = await request.text()
        if (request == 'err') return alert('Erro')
        const msg = JSON.parse(request)
        const container = document.querySelector('container')
        if (!msg.embeds ||  msg.embeds.length < 1) return alert('Erro')
        function normalize(text,title = false) {
            let str_ = ''
            text = text.split('﹖').join('?')
            for (const w of text)
                if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%¨&*()-+=§~^<>;:.,\\|/\'"`?\n '.indexOf(w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) >= 0) str_ += w
            if (title) {
                str_ = str_.toLowerCase()
                let firstWord = -1
                for (const w of str_) {
                    if ('abcdefghijklmnopqrstuvwxyz'.indexOf(w) >= 0) {
                        firstWord = str_.indexOf(w); break
                    }
                }
                if (firstWord >= 0) str_ = str_.substring(0,firstWord - 1) + str_[firstWord].toUpperCase() + str_.substring(firstWord + 1, str_.length)
            }
            let d = conv.makeHtml(str_.split('`').join(''))
            return d.split('*').join('')
        }
        for (const embed of msg.embeds) {
            let emb = '<div class="embed">'
            if (embed.title) emb += '<h1>' + normalize(embed.title, true) +  '</h1>'
            if (embed.description) emb += normalize(embed.description)
            if (embed.image && embed.image.url) emb += '<img src="' + embed.image.url + '">'
            container.innerHTML += emb + '</div>'
        }
    }
}