const urlParams = new URLSearchParams(window.location.search)
if (!urlParams.get('id')) alert('Erro')
const ids = urlParams.get('id').split(',')
const conv = new showdown.Converter({simplifiedAutoLink: true,simpleLineBreaks: true,strikethrough: true})

window.onload = async ()=> {
    if (!ids) return alert('Erro')
    for (const msgId of ids) {
        let request = await fetch('https://dfsbot.gabrielmota6.repl.co/api/dfsbot/journal?id=' + msgId)
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
                if ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%¨&*()[]-+=§~^<>;:.,\\|/\'"`?\n '.indexOf(w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) >= 0) str_ += w
            }
            str_ = str_.trim()
            str_ = discord(str_)
            let d = conv.makeHtml(str_.split('`').join(''))
            return d.split('*').join('')
        }
        function discord(text) {
            let se = -1,sp = -1
            for (let i = 0; i < text.length; i++) {
                const w = text[i]
                if (w == '<' && (text[i + 1] == ':' || text[i + 1] == 'a')) {
                    se = i
                }
                if (w == '>' && se >= 0) {
                    text = text.substring(0,se) + `<img class="emoji" src="https://cdn.discordapp.com/emojis/${text.substring(se,i + 1).split(':')[2].split('>').join('')}?size=32">` + text.substring(se + text.substring(se,i + 1).length, text.length)
                    se = -1
                }
                if (w == '|' && text[i + 1] == '|' && text[i - 1] !=  '\\') {
                    if (sp < 0) {
                        sp = i
                    } else {
                        text = text.substring(0, sp) + '<spoiler>' + text.substring(sp + 2, i) + '</spoiler>' + text.substring(i + 2,text.length)
                        sp = -1
                    }
                }
            }
            return text
        }
        for (const embed of msg.embeds) {
            let emb = '<div class="embed">'
            let halignOpen = false
            if (embed.thumbnail && embed.thumbnail.url) {
                halignOpen = true
                emb += '<halign>'
                emb += '<a href="'+ embed.thumbnail.url + '"><img class="thumbnail" src="' + embed.thumbnail.url + '"></a>'
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
        for (const spoiler of document.querySelectorAll('spoiler')) {
            spoiler.addEventListener('click', (e)=> {
                e.target.style.color = '#fff'
                e.target.style.backgroundColor = '#292b2f'
            })
            spoiler.addEventListener('touchstart', (e)=> {
                e.target.style.color = '#fff'
                e.target.style.backgroundColor = '#292b2f'
            })
        }
        document.querySelector('.author').innerHTML = normalize(msg.content)
        document.querySelector('footer').style.display = 'flex'
    }
}
