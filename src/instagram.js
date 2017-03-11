


function getPhotos_instagram(callback) {

    // var allPhotos = [];

    // var accessToken = '';


    // IG.init();
    // IG.login();
    IG.init({
        client_id: "350de239e7f64125b06fb038d5595083",
        check_status: true, // check and load active session
        cookie: true // persist a session via cookie
    });

    // client side access_token flow (implicit)
    // IG.login(function (response) {
    //     if (response.session) {
    //         // user is logged in
    //     }
    // }, {scope: ['comments', 'likes']});

    // // client side code flow
    IG.login(function (response) {
        if (response.code) {
            // user authorized app, send code to server
            // for access_token exchange
        }
    }, {response_type: 'code', scope: ['comments', 'likes']});
}