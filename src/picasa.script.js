

function getAllPhotos_Picasa(username) {
    var json_Album_URI = "https://picasaweb.google.com/data/feed/base/"
        + "user/"       +   username
        + "?alt="       +   "json"
        + "&kind="      +   "album"
        + "&hl="        +   "en_US"
        + "&fields="    +   "entry(media:group,id)"
        + "&thumbsize=" +   150;

    $.getJSON(json_Album_URI, function(data){
        $.each(data.feed.entry, function(i,item){
            //Thumbnail URL
            $.each(item.media$group.media$thumbnail, function(i,item){
                var album_thumb_URL = item.url;
                 console.log("Album Thumbnail:" + album_thumb_URL);
                // $('#images').append("Album Thumbnail: " + album_thumb_URL + '<br />');
            });
            //Album Title
            var album_Title = item.media$group.media$title.$t;
            // $('#images').append("Album Title: " + album_Title + '<br />');
            console.log("album_Title:" + album_Title);
            //Album Description
            var album_Description = item.media$group.media$description.$t;
            // $('#images').append("Album Description: " + album_Description + '<br />');
            //Album ID
            var album_ID = item.id.$t;
                //Get Numerical ID from URL
            album_ID = album_ID.split('/')[9].split('?')[0];
            // $('#images').append("AlbumID: " + album_ID + '<br /><br />');

            var json_Photo_URI = "https://picasaweb.google.com/data/feed/base/"
                + "user/"       +   username
                + "/albumid/"   +   album_ID
                + "?alt="       +   "json"
                + "&kind="      +   "photo"
                + "&hl="        +   "en_US"
                + "&fields="    +   "entry(media:group)"
                + "&thumbsize=" +   150;


            $.ajax({
                type: 'GET',
                url: json_Photo_URI,
                success : function(data) {
                    var photos = [];
                    console.log("json_Photo_URI = " + json_Photo_URI);
                    $.each(data.feed.entry, function(i,item){
                        // $('#images').append("Album Photos: <br />");
                            console.log("item=" + item);
                        //Photo URL
                        $.each(item.media$group.media$content, function(i,item){
                            console.log("item=" + item.url);
                            var photo_URL = item.url;
                            photos.push({
                                'url'   :   photo_URL
                            });
                            //$('#images').append("Image Photo URL: " + photo_URL + '<br />');
                        });
                        //Thumbnail URL
                        $.each(item.media$group.media$thumbnail, function(i,item){
                            var photo_Thumb_URL = item.url;
                            // $('#images').append("Image Thumbnail URL: " + photo_Thumb_URL + '<br />');
                        });

                        //Photo Title
                        // var photo_Title = item.media$group.media$title.$t;
                        // $('#images').append("Image Photo_Title: " + photo_Title + '<br />');
                        // //Photo Description
                        // var photo_Description = item.media$group.media$description.$t;
                        // $('#images').append("Image Photo Description: " + photo_Description + '<br /><br />');
                    });
                    console.log("allPhotos = " + photos);
                },
                dataType: 'json',
                async: false
            
            });
        });
    });
}

function getAlbum_Picasa(username)
{
    console.log(username);
    var albums = [];
    var json_Album_URI = "https://picasaweb.google.com/data/feed/base/"
        + "user/"       +   username
        + "?alt="       +   "json"
        + "&kind="      +   "album"
        + "&hl="        +   "en_US"
        + "&fields="    +   "entry(media:group,id)"
        + "&thumbsize=" +   150;
        console.log(json_Album_URI);

    $.getJSON(json_Album_URI, function(data) 
    {
        $.each(data.feed.entry, function(i,item) 
        {
            //Thumbnail URL
            var album_thumb_URL;
            $.each(item.media$group.media$thumbnail, function(i,item) 
            {
                album_thumb_URL = item.url;
                console.log("Album Thumbnail:" + album_thumb_URL);
            });
            //Album Title
            // var album_Title = item.media$group.media$title.$t;
            // // $('#images').append("Album Title: " + album_Title + '<br />');
            // console.log("album_Title:" + album_Title);
            // //Album Description
            // var album_Description = item.media$group.media$description.$t;
            // // $('#images').append("Album Description: " + album_Description + '<br />');
            //Album ID
            var album_ID = item.id.$t;
            //Get Numerical ID from URL
            album_ID = album_ID.split('/')[9].split('?')[0];
            console.log("AlbumID:" + album_ID);
            // // $('#images').append("AlbumID: " + album_ID + '<br /><br />');
            albums.push({
                'albumid' : album_ID,
                'url'   :   album_thumb_URL,
                'username' : username
            });
            console.log(albums);
        });

        console.log("final:", albums);
        addAlbums_listpanel(albums);

    });
}

function getPicasaPhotosFromAlbum(username, albumID)
{
    var json_Photo_URI = "https://picasaweb.google.com/data/feed/base/"
        + "user/"       +   username
        + "/albumid/"   +   albumID
        + "?alt="       +   "json"
        + "&kind="      +   "photo"
        + "&hl="        +   "en_US"
        + "&fields="    +   "entry(media:group)"
        + "&thumbsize=" +   150;

    $.ajax({
        type: 'GET',
        url: json_Photo_URI,
        success : function(data) {
            var photos = [];
            console.log("json_Photo_URI = " + json_Photo_URI);
            $.each(data.feed.entry, function(i,item){
                // $('#images').append("Album Photos: <br />");
                    console.log("item=" + item);
                //Photo URL
                $.each(item.media$group.media$content, function(i,item){
                    console.log("item=" + item.url);
                    var photo_URL = item.url;
                    photos.push({
                        'url'   :   photo_URL
                    });
                    //$('#images').append("Image Photo URL: " + photo_URL + '<br />');
                });
                //Thumbnail URL
                // $.each(item.media$group.media$thumbnail, function(i,item){
                //     var photo_Thumb_URL = item.url;
                //     // $('#images').append("Image Thumbnail URL: " + photo_Thumb_URL + '<br />');
                // });

                //Photo Title
                // var photo_Title = item.media$group.media$title.$t;
                // $('#images').append("Image Photo_Title: " + photo_Title + '<br />');
                // //Photo Description
                // var photo_Description = item.media$group.media$description.$t;
                // $('#images').append("Image Photo Description: " + photo_Description + '<br /><br />');

            });
            addPhotosAtlistpanel(photos);
        },
        dataType: 'json',
        async: false
    });
}