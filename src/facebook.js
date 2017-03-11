////////////////////////////////Get All Image////////////////////////////////
function makeFacebookPhotoURL( id, accessToken ) {
	return 'https://graph.facebook.com/' + id + '/picture?access_token=' + accessToken;
}

function login( callback ) {
	FB.login(function(response) {
		if (response.authResponse) {
			//console.log('Welcome!  Fetching your information.... ');
			if (callback) {
				callback(response);
			}
		} else {
			console.log('User cancelled login or did not fully authorize.');
		}
	},{scope: 'user_photos'} );
}

function getAlbums( callback ) {
	FB.api(
			'/me/albums',
			{fields: 'id,cover_photo'},
			function(albumResponse) {
				//console.log( ' got albums ' );
				if (callback) {
					callback(albumResponse);
				}
			}
		);

}

function getPhotosForAlbumId( albumId, callback ) {
	FB.api(
			'/'+albumId+'/photos',
			{fields: 'id'},
			function(albumPhotosResponse) {
				//console.log( ' got photos for album ' + albumId );
				if (callback) {
					callback( albumId, albumPhotosResponse );
				}
			}
		);
}

function getLikesForPhotoId( photoId, callback ) {
	FB.api(
			'/'+albumId+'/photos/'+photoId+'/likes',
			{},
			function(photoLikesResponse) {
				if (callback) {
					callback( photoId, photoLikesResponse );
				}
			}
		);
}

function getPhotos_facebook(callback) {

	var allPhotos = [];

	var accessToken = '';

	login(function(loginResponse) {
			accessToken = loginResponse.authResponse.accessToken || '';
			getAlbums(function(albumResponse) {
					var i, album, deferreds = {}, listOfDeferreds = [];

					for (i = 0; i < albumResponse.data.length; i++) {
						album = albumResponse.data[i];
						deferreds[album.id] = $.Deferred();
						listOfDeferreds.push( deferreds[album.id] );
						getPhotosForAlbumId( album.id, function( albumId, albumPhotosResponse ) {
								var i, facebookPhoto;
								for (i = 0; i < albumPhotosResponse.data.length; i++) {
									facebookPhoto = albumPhotosResponse.data[i];
									allPhotos.push({
										'id'	:	facebookPhoto.id,
										'added'	:	facebookPhoto.created_time,
										'url'	:	makeFacebookPhotoURL( facebookPhoto.id, accessToken )
									});
								}
								deferreds[albumId].resolve();
							});
					}

					$.when.apply($, listOfDeferreds ).then( function() {
						if (callback) {
							callback( allPhotos );
						}
					}, function( error ) {
						if (callback) {
							callback( allPhotos, error );
						}
					});
				});
		});
}
    
    
//////////////////////////////////////Get User Info////////////////////////////////////////////////
function Login_userInfo()
{
	FB.login(function(response) {
		if (response.authResponse) 
		{
			getUserInfo();
		}
		else 
		{
		 console.log('User cancelled login or did not fully authorize.');
		}
	},{scope: 'email,user_photos,user_videos'});
}

function getUserInfo() {
	FB.api('/me', function(response) {

		var str="<b>Name</b> : "+response.name+"<br>";
		str +="<b>Link: </b>"+response.link+"<br>";
		str +="<b>Username:</b> "+response.username+"<br>";
		str +="<b>id: </b>"+response.id+"<br>";
		str +="<b>Email:</b> "+response.email+"<br>";
		str +="<input type='button' value='Get Photo' onclick='getPhoto();'/>";
		str +="<input type='button' value='Logout' onclick='Logout();'/>";
		document.getElementById("status").innerHTML=str;
	});
}

function getPhoto()
{
	FB.api('/me/picture?type=normal', function(response) {

		var str="<br/><b>Pic</b> : <img src='"+response.data.url+"'/>";
 		document.getElementById("status").innerHTML+=str;
	});
}

function Logout()
{
	FB.logout(function(){document.location.reload();});
}


// window.fbAsyncInit = function() {
//   FB.init({
//     appId      : '113455642165175', // App ID
//     // channelUrl : 'http://hayageek.com/examples/oauth/facebook/oauth-javascript/channel.html', // Channel File
//     status     : true, // check login status
//     cookie     : true, // enable cookies to allow the server to access the session
//     xfbml      : true  // parse XFBML
//   });
// Load the SDK asynchronously
// (function(d){
//    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
//    if (d.getElementById(id)) {return;}
//    js = d.createElement('script'); js.id = id; js.async = true;
//    js.src = "//connect.facebook.net/en_US/all.js";
//    ref.parentNode.insertBefore(js, ref);
//  }(document));


var docReady = $.Deferred();
var facebookReady = $.Deferred();

// $(document).ready(docReady.resolve);

window.fbAsyncInit = function() {
	FB.init({
		// appId      : '1725760201012586', //Dol
		appId      : '1725831321005474', //Testing
		// appId      : '130257967407700', //Testing
		channelUrl : '//conor.lavos.local/channel.html',
		xfbml      : true,
		version    : 'v2.6'
	});
	FB.Event.subscribe('auth.authResponseChange', function(response) 
	{
		if (response.status === 'connected') 
		{
			document.getElementById("message").innerHTML +=  "<br>Connected to Facebook";
			//SUCCESS

		}	 
		else if (response.status === 'not_authorized') 
		{
			document.getElementById("message").innerHTML +=  "<br>Failed to Connect";

			//FAILED
		}
		else 
		{
			document.getElementById("message").innerHTML +=  "<br>Logged Out";

			//UNKNOWN ERROR
		}
	});	
	facebookReady.resolve();
};

// $.when(docReady, facebookReady).then(function() {
// 	if (typeof getPhotos !== 'undefined') {
// 		console.log( "login" );
// 		getPhotos_facebook( function( photos ) {
// 			console.log( photos );
// 		});
// 	}
// });

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));



function getPhoto()
{
	FB.api('/me/picture?type=normal', function(response) {

		var str="<br/><b>Pic</b> : <img src='"+response.data.url+"'/>";
 		document.getElementById("status").innerHTML+=str;
	});
}

function getAlbumCoverFromAlbumId(albumId, callback)
{
	FB.api('/'+albumId+'/picture', {fields: 'id'}, function(albumPictureResponse) {
		// console.log( ' got cover photo for album : ' + albumPictureResponse );
		if (callback) {
			callback( albumId, albumPictureResponse );
		}
	});
}

var facebookAccessToken = "token";

function getFacebookAlbum(callback)
{
	var accessToken = '';
	var newAlbums = [];

	login(function(loginResponse) {
		accessToken = loginResponse.authResponse.accessToken || '';
		facebookAccessToken = accessToken;
		getAlbums(function(albumResponse) {
			var i, album, deferreds = {}, listOfDeferreds = [];
			for (i = 0; i < albumResponse.data.length; i++)
			{
				album = albumResponse.data[i];
				deferreds[album.id] = $.Deferred();
				listOfDeferreds.push( deferreds[album.id] );
				// getAlbumCoverFromAlbumId( album.id, function( albumId, albumPictureResponse ) {
					// console.log(albumId);
					// console.log(albumPictureResponse);
					// var albumcover = "https://graph.facebook.com/" + album.id + "/picture";
					var albumcover = makeFacebookPhotoURL( album.id, accessToken );
					newAlbums.push({
							'albumid'	: album.id,
							'url'	: albumcover
						});
					deferreds[album.id].resolve();
				// });
			}

			$.when.apply($, listOfDeferreds ).then( function() {
				if (callback) {
					callback( newAlbums );
				}
			}, function( error ) {
				if (callback) {
					callback( newAlbums, error );
				}
			});
		});
	});
}

function getFacebookPhotosFromAlbumID(albumId)
{
	var accessToken = facebookAccessToken;
	var allPhotos = [];

	getPhotosForAlbumId( albumId, function( albumId, albumPhotosResponse ) {
		console.log("getPhotosForAlbumId====", albumPhotosResponse.data);
		var i, facebookPhoto;
		for (i = 0; i < albumPhotosResponse.data.length; i++) {
			facebookPhoto = albumPhotosResponse.data[i];
			allPhotos.push({
				// 'id'	:	facebookPhoto.id,
				// 'added'	:	facebookPhoto.created_time,
				'url'	:	makeFacebookPhotoURL( facebookPhoto.id, accessToken )
			});
		}
		addPhotosAtlistpanel(allPhotos);
	});
}
