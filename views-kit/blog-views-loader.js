(function () {
    var refreshMs = 5 * 60 * 1000;
    var viewsJsonUrls = [
        'https://divangames.github.io/buhgalter/views.json',
        'https://cdn.jsdelivr.net/gh/divangames/buhgalter@main/views.json'
    ];

    function formatViews(value) {
        var number = Number(value);
        if (!isFinite(number)) return '—';
        return number.toLocaleString('ru-RU');
    }

    function parseJsonResponse(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
    }

    function fetchViewsByUrl(url) {
        return fetch(url, { cache: 'no-store', mode: 'cors' })
            .then(parseJsonResponse);
    }

    function fetchViewsJson() {
        function tryNext(index) {
            if (index >= viewsJsonUrls.length) {
                throw new Error('All views sources failed');
            }
            var url = viewsJsonUrls[index];
            return fetchViewsByUrl(url).catch(function () {
                var proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
                return fetchViewsByUrl(proxyUrl).catch(function () {
                    return tryNext(index + 1);
                });
            });
        }
        return tryNext(0);
    }

    function normalizePath(href) {
        if (!href) return '';
        try {
            var url = new URL(href, window.location.origin);
            var pathname = decodeURIComponent(url.pathname || '/');
            return pathname.replace(/\/+$/, '') || '/';
        } catch (e) {
            return String(href).replace(/\/+$/, '') || '/';
        }
    }

    function getArticlePathByNode(node) {
        var card = node.closest('.blog-card');
        if (!card) return '';
        var link = card.querySelector('h2 a[href]') || card.querySelector('a[href]');
        if (!link) return '';
        return normalizePath(link.getAttribute('href'));
    }

    function applyViewsToNode(node, viewsText) {
        var valueNode = node.querySelector('.lpm-blog-views-value');
        if (valueNode) valueNode.textContent = viewsText;
    }

    function updateViews() {
        var viewNodes = Array.prototype.slice.call(document.querySelectorAll('.lpm-blog-views'));
        if (!viewNodes.length) return;

        fetchViewsJson()
            .then(function (data) {
                var viewsMap = (data && data.views) || {};
                viewNodes.forEach(function (node) {
                    var articlePath = getArticlePathByNode(node);
                    applyViewsToNode(node, formatViews(viewsMap[articlePath]));
                });
            })
            .catch(function () {
                viewNodes.forEach(function (node) { applyViewsToNode(node, '—'); });
            });
    }

    function startViewsAutoUpdate() {
        updateViews();
        setInterval(updateViews, refreshMs);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startViewsAutoUpdate);
    } else {
        startViewsAutoUpdate();
    }
})();
