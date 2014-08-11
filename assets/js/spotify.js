function getUserPlayLists(url, div) {
    $.getJSON(url,
        function (data) {
            if (data.result === "OK") {
                loadPlaylists(data, div);
            } else {
                $(div).html('No fu\u00e9 posible obtener las listas de reproduccion desde Spotify');
            }
        },
        function (jqXHR, textStatus, errorThrown) {
            $(div).html('error: ' + textStatus + " " + errorThrown);
        }
    );
}

function getUserPlayList(url, parent, result) {
    $(parent).click(function (handler) {
        var target = handler.target;
        if (target !== null && target.classList.contains('load')) {
            handler.preventDefault();
            var playlist_id = target.getAttribute('data-id');
            var playlist_owner_id = target.getAttribute('data-owner-id');
            $.ajax({
                url: url,
                data: {playlist_id: playlist_id, playlist_owner_id: playlist_owner_id},
                success: function (data) {
                    loadPlaylist(data, result);
                },
                error: function(jqXHR, textStatus, errorThrown){
                    $(result).html('error: ' + textStatus + " " + errorThrown);
                }
            });
        }
    });

}

function loadPlaylists(data, div) {
    var html = '<h3>[Playlists]</h3>';
    html += '<ul>';
    $.each(data.playlists.items, function (index, item) {
        html += '<li>';
        html += '<a href="#" class="load" data-id="' + item.id + '" data-owner-id="' + item.owner.id + '">' + item.name + '</a>';
        html += '</li>';
    });
    html += '</ul>';
    $(div).html(html);
}

function loadPlaylist(data, div) {
    if (data.result === "OK") {
        var html = "<h3>" + data.playlist.name + "</h3>";
        if (data.playlist.description !== null) {
            html += "<p>" + data.playlist.description + "</p>";
        }
        if (data.playlist.images.length) {
            html += "<img style=\"background-image:url(" + data.playlist.images[0].link + ")\" class=\"cover\"/>";
        }
        html += "<br/>";
        html += "<table>";
        html += "<tr>";
        html += "<th>Track</th>";
        html += "<th>Artist</th>";
        html += "<th>Album</th>";
        html += "</tr>";
        $.each(data.playlist.tracks.items, function (index, item) {
            html += "<tr>";
            html += "<td>" + item.track.name + "</td>";
            html += "<td>";
            $.each(item.track.artists, function (index, artist) {
                html += artist.name + " ";
            });
            html += "</td>";
            html += "<td>" + item.track.album.name + "</td>";
            html += "</tr>";
        });
        html += "</table>";
        $(div).html(html);
    } else {
        $(div).html('No fu\u00e9 posible obtener la lista de reproduccion desde Spotify');
    }
}