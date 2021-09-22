$(() => {
    const urlAPI = "https://swapi.dev/api/"
    const svgPrev = `<svg class="prev" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="currentColor" d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path>
    </svg>`
    const svgNext = `<svg class="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path>
    </svg>`

    const $header = $('<header></header>').appendTo(document.body)
    const $main = $('<main></main>').appendTo(document.body)
    const $list = $('<div class="list"></div>').appendTo($main)
    const $info = $('<div class="info"></div>').appendTo($main)

    // Creation du menu
    const $nav = $('<nav><div class="loader"></div></nav>').appendTo($header)
    $.get(urlAPI, data => {
        console.log('loading menu', '|', 'get url ->', urlAPI, '|', 'data ->', data)
        $nav.html('')

        for (const index in data) {
            $(`<div class="item">${index}</div>`)
                .appendTo($nav)
                .click(() => showPage(index, data[index]))
        }
    })

    /**
     * @param name {string} - nom de la page
     * @param url {string} - url de l'API
     */
    function showPage(name, url) {
        console.log('showPage ->', name, '|', 'url ->', url)

        $list.html('<div class="loader"></div>')
        $info.html('')

        $.get(url, data => {
            console.log('loading page', '|', 'get url ->', url, '|', 'data ->', data)

            $list.html('')
            $(`<h2>Liste des ${name} (${data.count})</h2>`).appendTo($list)

            if (data['results'] instanceof Array) {
                data['results'].forEach(result => {
                    $(`<div class="item">${result.name || result.title}</div>`)
                        .click(() => showInfo(result))
                        .appendTo($list)
                })
            }

            if (data['previous'] !== null || data['next'] !== null) {
                const $paginator = $('<div class="paginator"></div>').appendTo($list)

                const $prev = $('<div class="prev"></div>').appendTo($paginator)
                if (data['previous'] !== null) {
                    $prev
                        .html(svgPrev)
                        .click(() => showPage(name, data['previous']))
                }

                const $next = $('<div class="next"></div>').appendTo($paginator)
                if (data['next'] !== null) {
                    $next
                        .html(svgNext)
                        .click(() => showPage(name, data['next']))
                }
            }
        })
    }

    /**
     * @param data {Object}
     */
    function showInfo(data) {
        console.log('showInfo', ' | ', 'data ->', data)

        $info.html('')
        $(`<h2>Informations supplémentaire</h2>`).appendTo($info)

        for (const key in data) {
            const $div = $(`<div class="item"></div>`)
            $(`<div class="key">${key.replaceAll('_', ' ')}</div>`).appendTo($div)

            if (data[key] instanceof Array) {
                const $value = $(`<div class="value-multiple"></div>`)

                if (!data[key].length) $value.html('-----')
                else data[key].forEach(value => parseValue(value).appendTo($value))

                $value.appendTo($div)
            } else {
                parseValue(data[key]).appendTo($div)
            }

            $div.appendTo($info)
        }
    }

    /**
     * @param value {string|null}
     */
    function parseValue(value) {
        if (value === null || value === '') return $(`<div class="value">-----</div>`)
        else if (typeof value === 'number') return $(`<div class="value">${value}</div>`)
        else if (value.startsWith('http')) {
            const $value = $('<div class="value-link"><div class="loader"></div></div>')
            $.get(value, data => $value.html(data.name || data.title).click(() => showInfo(data)))
            return $value
        } else if (value.match('[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{6}Z')) {
            return $(`<div class="value">${new Date(Date.parse(value)).toLocaleString()}</div>`)
        } else if (value.match('[0-9]{4}-[0-9]{2}-[0-9]{2}')) {
            return $(`<div class="value">${new Date(Date.parse(value)).toLocaleString('fr-FR')}</div>`)
        }

        return $(`<div class="value">${value}</div>`)
    }
})