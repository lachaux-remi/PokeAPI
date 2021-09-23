$(() => {
    // Url de base de l'API star wars
    const urlAPI = "https://swapi.dev/api/"
    /** @type {string} - balise <svg> pour la fleche page précédente */
    const svgPrev = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="currentColor" d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path>
    </svg>`
    /** @type {string} - balise <svg> pour la fleche page suivante */
    const svgNext = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path>
    </svg>`

    // Creation du <h1> et on l'ajoute au body
    $('<h1>Star Wars API</h1>').appendTo(document.body)
    // Creation du <header> et on l'ajoute au body
    const $header = $('<header></header>').appendTo(document.body)
    // Creation du <main> et on l'ajoute au body
    const $main = $('<main></main>').appendTo(document.body)
    // Creation d'une <div class=list> et on l'ajoute au <main>
    const $list = $('<div class="list"></div>').appendTo($main)
    // Creation d'une <div class=info> et on l'ajoute au <main>
    const $info = $('<div class="info"></div>').appendTo($main)

    // Creation du menu
    const $nav = $('<nav><div class="loader"></div></nav>').appendTo($header)
    $.get(urlAPI, data => {
        console.log('loading menu', '|', 'get url ->', urlAPI, '|', 'data ->', data) // affiche un debug
        $nav.html('')

        // pour chaque clé de l'object data
        for (const index in data) {
            // on crée une <div> qui a en html la clé
            $(`<div class="item">${index}</div>`)
                .appendTo($nav) // on l'ajoute a la <nav>
                .click(() => showPage(index, data[index])) // on ajoute l'event au clic qui appel la fonction showPage()
            // ex: showPage('people', 'https://swapi.dev/api/people/')
        }
    })

    /**
     * @param name {string} - nom de la page
     * @param url {string} - url de l'API
     */
    function showPage(name, url) {
        console.log('showPage ->', name, '|', 'url ->', url) // affiche un debug

        // On modifier le html de la <div class=list> et on ajoute une <div class=loader>
        $list.html('<div class="loader"></div>')
        $info.html('') // on efface le contenue de la <div class=info>

        $.get(url, data => {
            console.log('loading page', '|', 'get url ->', url, '|', 'data ->', data)

            $list.html('') // on efface le contenue de la <div class=list>
            // creation d'un <h2> qui affiche le nom de la page et le nombre d'element
            // et on l'ajoute a la <div class=list>
            $(`<h2>List of ${name} (${data.count})</h2>`).appendTo($list)

            // si le date[results] est un Array
            if (data['results'] instanceof Array) {
                // on boucle dessus
                data['results'].forEach(result => {
                    // pour chaque result on crée une <div class=item> qui aura comme html le nom ou le title si le nom est undefined
                    $(`<div class="item">${result.name || result.title}</div>`)
                        .appendTo($list)  // on l'ajoute a la <div class=list>
                        .click(() => showInfo(result)) // on ajoute l'event au clic qui appel la fonction showInfo()
                    // ex: showInfo({name: 'Luke Skywalker', height: '172', ...})
                })
            }

            // si on a une url dans data[previous] ou dans data[next]
            if (data['previous'] !== null || data['next'] !== null) {
                // on crée une <div class=paginator> et on l'ajoute a <div class=list>
                const $paginator = $('<div class="paginator"></div>').appendTo($list)


                // on crée une <div class=prev> et on l'ajoute a <div class=paginator>
                const $prev = $('<div class="prev"></div>').appendTo($paginator)
                // si on a une url
                if (data['previous'] !== null) {
                    $prev
                        .html(svgPrev) // on ajoute au html la fleche gauche
                        .click(() => showPage(name, data['previous'])) // on ajoute l'event au clic qui appel la fonction showPage()
                }

                // on crée une <div class=next> et on l'ajoute a <div class=paginator>
                const $next = $('<div class="next"></div>').appendTo($paginator)
                // si on a une url
                if (data['next'] !== null) {
                    $next
                        .html(svgNext) // on ajoute au html la fleche droite
                        .click(() => showPage(name, data['next'])) // on ajoute l'event au clic qui appel la fonction showPage()
                }
            }
        })
    }

    /**
     * @param data {Object}
     */
    function showInfo(data) {
        console.log('showInfo', ' | ', 'data ->', data) // affiche un debug

        $info.html('') // on efface le contenue de la <div class=info>
        // creation d'un <h2> et on l'ajoute a la <div class=info>
        $(`<h2>Additional information</h2>`).appendTo($info)

        // Pour chaque clé dans l'object data
        for (const key in data) {
            // on crée une <div class=item>
            const $div = $(`<div class="item"></div>`)
            // on crée une <div class=key> avec comme value html la clé de l'object ou on retire les _
            // et on l'ajoute a <div class=item>
            $(`<div class="key">${key.replaceAll('_', ' ')}</div>`).appendTo($div)

            // si la valeur de data[key] et un Array
            if (data[key] instanceof Array) {
                // on crée une <div class=value-multiple>
                const $value = $(`<div class="value-multiple"></div>`)

                // Si data[key].length est 0 ou null ou undefined on définis le html en -----
                if (!data[key].length) $value.html('-----')
                else {
                    // Sinon pour la value on boucle sur chaque element que l'on passe a la fonction parseValue()
                    // et on l'ajoute a <div class=value-multiple>
                    data[key].forEach(value => parseValue(value).appendTo($value))
                }

                // on ajoute <div class=value-multiple> a la <div class=item>
                $value.appendTo($div)
            } else {
                // sinon on passe la valeur a la fonction parseValue() et on l'ajoute a la <div class=item>
                parseValue(data[key]).appendTo($div)
            }

            // on ajoute <div class=item> a la <div class=info>
            $div.appendTo($info)
        }
    }

    /**
     * @param value {string|null}
     */
    function parseValue(value) {
        if (value === null || value === '') { // Si la valeur et null ou vide on crée une <div class=value> avec comme html ----- et on le retourne
            return $(`<div class="value">-----</div>`)
        } else if (typeof value === 'number') { // sinon si le type de valuer est un number <div class=value> avec comme html la valeur et on le retourne
            return $(`<div class="value">${value}</div>`)
        } else if (value.startsWith('http')) { // sinon si la valeur commence par http
            // on crée une <div class=value-link> avec comme html une <div class=loader>
            const $value = $('<div class="value-link"><div class="loader"></div></div>')
            // on appel le lien pour un affichage plus propre avec les date recus
            // on modifier le html avec le name ou le title si le name est undefined
            // on ajoute l'event au clic qui appel la fonction showInfo()
            $.get(value, data => $value.html(data.name || data.title).click(() => showInfo(data)))
            // et on le retourne
            return $value
        } else if (value.match('[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{6}Z')) { // sinon si la value est un format de date
            // on crée une <div class=value> avec comme html la date parser au format en-US et on le retourne
            return $(`<div class="value">${new Date(Date.parse(value)).toLocaleString('en-US')}</div>`)
        }

        // dans tout les autre cas on crée une <div class=value> avec comme html la valeur et on la retourne
        return $(`<div class="value">${value}</div>`)
    }
})