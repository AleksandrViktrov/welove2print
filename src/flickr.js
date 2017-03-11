

function getAlbum_Flickr(username)
{
    var api_key = "87e108bade19e21e6fd945e62f944ecf";
    var api_secret = "8a45658705e624ad";
    $.ajax (
    {
        type: "POST",
        url: "server/php/flickr/index.php", 
        // url: "server/php/phpflickr-master/auth.php", 
        // data: ({api_key : api_key, api_secret : api_secret}),
        cache: false,
        success: function(result)
        {
            console.log("api-sig", result);
            var api_sig = result;
            var data;
            //Get Frob
            json_URI = "https://api.flickr.com/services/rest/?method=flickr.auth.getFrob&"
                + 'api_key='    +   api_key
                + "&format="    +   "json"
                + "&nojsoncallback=1"
                + "&api_sig="   +   api_sig;
            console.log(json_URI);
            $.getJSON(json_URI, function(data)
            {
                console.log("Frob", data);
                var frob = data.frob._content;

                //Get Auth_Token
                json_URI = "https://api.flickr.com/services/rest/?method=flickr.auth.getToken&"
                    + 'api_key='    +   api_key
                    + 'frob='       +   frob
                    + "&format="    +   "json"
                    + "&nojsoncallback=1"
                    + "&api_sig="   +   api_sig;
                $.getJSON(json_URI, function(data)
                {
                    console.log("auto_token", data);
                    var auto_token = data.user.id;

            // var json_URI = "https://api.flickr.com/services/rest/?method=flickr.people.findByUsername&"
            //     + 'api_key='    +   api_key
            //     + "&username="  +   username
            //     + "&format="    +   "json"
            //     + "&nojsoncallback=1";
            // $.getJSON(json_URI, function(data)
            // {
            // var user_id = data.user.id;
            //     console.log(data);
            //     {
            //         console.log(data);
            //         var auth_token = data.auth_token;
            //         json_URI = "https://api.flickr.com/services/rest/?method=flickr.photosets.getList&"
            //             + 'api_key='        +   api_key
            //             + "&user_id="       +   user_id
            //             + "&format="        +   "json"
            //             + "&auth_token="    +   auth_token
            //             + "&api_sig="       +   api_sig;
            //         $.getJSON(json_URI, function(data)
            //         {

            //         });
                 });
            });
        }
    });







    // var api_key = '7ad63af9ae67a7fb49fff11dff37ddcd';
    // // https://api.flickr.com/services/rest/?method=flickr.auth.oauth.getAccessToken&api_key=7ad63af9ae67a7fb49fff11dff37ddcd&format=json&nojsoncallback=1

    // // var json_URI = "https://api.flickr.com/services/rest/?method=flickr.auth.oauth.getAccessToken&"
    // //     + 'api_key='    +   api_key
    // //     + "&format="    +   "json"
    // //     + "&nojsoncallback=1"

    // // $.getJSON(json_URI, function(data) 
    // // {
    // //     console.log(data.stat);
    // // });

    // var json_URI = "https://api.flickr.com/services/rest/?method=flickr.people.findByUsername&"
    //     + 'api_key='    +   api_key
    //     + "&username="  +   username
    //     + "&format="    +   "json"
    //     + "&nojsoncallback=1";

    // $.getJSON(json_URI, function(data) 
    // {
    //     // https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=3018b8c98fbeb8879de8819353b66d31&user_id=144858504%40N02&format=json&nojsoncallback=1
    //     var albums = [];
    //     json_URI = "https://api.flickr.com/services/rest/?method=flickr.photosets.getList&"
    //         + 'api_key='    +   api_key
    //         + "&user_id="   +   data.user.id
    //         + "&format="    +   "json"
    //         + '&auth_token=72157667967984164-34db70d4e8c7ef60&api_sig=d2aba57d5f3f490768bfab41bbfe8bc6';

    //                 console.log('json_URI=', json_URI);
    //     $.getJSON(json_URI, function(data) 
    //     {
    //                 console.log('data=', data);
    //         $.each(data.photosets, function(i,item) 
    //         {
    //             $.each(item.photoset, function(i,item) 
    //             {
    //                 console.log('photoset=', item);
    //             });
    //         });
    //     });
    // });


    // $.getJSON(json_Album_URI, function(data) 
    // {
    //     $.each(data.feed.entry, function(i,item) 
    //     {
    //         //Thumbnail URL
    //         var album_thumb_URL;
    //         $.each(item.media$group.media$thumbnail, function(i,item) 
    //         {
    //             album_thumb_URL = item.url;
    //             console.log("Album Thumbnail:" + album_thumb_URL);
    //         });
    //         //Album Title
    //         // var album_Title = item.media$group.media$title.$t;
    //         // // $('#images').append("Album Title: " + album_Title + '<br />');
    //         // console.log("album_Title:" + album_Title);
    //         // //Album Description
    //         // var album_Description = item.media$group.media$description.$t;
    //         // // $('#images').append("Album Description: " + album_Description + '<br />');
    //         //Album ID
    //         var album_ID = item.id.$t;
    //         //Get Numerical ID from URL
    //         album_ID = album_ID.split('/')[9].split('?')[0];
    //         console.log("AlbumID:" + album_ID);
    //         // // $('#images').append("AlbumID: " + album_ID + '<br /><br />');
    //         albums.push({
    //             'albumid' : album_ID,
    //             'url'   :   album_thumb_URL,
    //             'username' : username
    //         });
    //         console.log(albums);
    //     });

    //     console.log("final:", albums);
    //     addAlbums_listpanel(albums);

    // });
}