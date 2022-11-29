const urlParams = new URLSearchParams(window.location.search)
if (!urlParams.get('id')) alert('Erro')
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
            text = text.split('﹖').join('?').split('﹒').join(' ')
            if (title) {
                for (const w of text)
                if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&-+.<>,\\|/\'"? '.indexOf(w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) >= 0) str_ += w
                str_ = str_.toLowerCase()
                let firstWord = -1
                for (const w of str_) {
                    if ('abcdefghijklmnopqrstuvwxyz'.indexOf(w.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) >= 0) {
                        firstWord = str_.indexOf(w); break
                    }
                }
                if (firstWord >= 0) str_ = str_.substring(0,firstWord - 1) + str_[firstWord].toUpperCase() + str_.substring(firstWord + 1, str_.length)
            } else {
                for (const w of text)
                if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%¨&*()-+=§~^<>;:.,\\|/\'"`?\n '.indexOf(w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) >= 0) str_ += w
            }
            let d = conv.makeHtml(str_.split('`').join(''))
            return d.split('*').join('')
        }
        for (const embed of msg.embeds) {
            let emb = '<div class="embed">'
            let halignOpen = false
            if (embed.thumbnail && embed.thumbnail.url) {
                halignOpen = true
                emb += '<halign>'
                emb += '<img class="thumbnail" src="' + embed.thumbnail.url + '">'
            }
            if (embed.title) {
                halignOpen = false
                emb += '<h1>' + normalize(embed.title, true) +  '</h1> </halign>'
            }
            if (embed.description) emb += normalize(embed.description)
            if (halignOpen) emb +=  '</halign>'
            if (embed.image && embed.image.url) emb += '<img class="image" src="' + embed.image.url + '">'
            container.innerHTML += emb + '</div>'
        }
    }
}