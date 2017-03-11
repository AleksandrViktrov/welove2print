
function addAlbums_listpanel(albums)
{
	$("#upload_picasa").css("display", "none");
	$("#album_list_panel").css("display", "block");
	console.log( "albums : " + albums );
	$("#album_button_list").fadeIn();

	var list = document.getElementById("album_button_list");
	while(list.firstChild)
	{
		list.removeChild(list.firstChild);
	}
	for(var i = 0; i < albums.length; i++)
	{
		if(i > 10)
			break;
		var html = '<li><a href="#" onclick="showPhotos_listpanel(' + "'";
		html += albums[i].username + "','";
		html += albums[i].albumid;
		html += "'); " + 'return false;"><img id="';
		html += albums[i].albumid;
		html += '" src="';
		html += albums[i].url;
		html += '"></a></li>';
		console.log("html, ", html);
		// var html = "<li><img src='" + albums[i].url + "'></img></li>";
		$("#album_button_list").append(html);
	}
}

function showPhotos_listpanel(username, albumID)
{
	console.log("albumID : ", albumID);
	$("#album_list_panel").css("display", "none");
	$("#image_list_panel").css("display", "block");
	$("#photos_list").fadeIn();
	// getPicasaPhotosFromAlbum(username, albumID);
	getFacebookPhotosFromAlbumID(albumID);
}

function addPhotosAtlistpanel(photos) 
{
	var list = document.getElementById("photos_list");
	while(list.firstChild)
	{
		list.removeChild(list.firstChild);
	}
	for(var i = 0; i < photos.length; i++)
	{
		if(i > 10)
			break;
		var html = "<li><img src='" + photos[i].url + "'></img></li>";
		$("#photos_list").append(html);
		$("#photos_list li").draggable({helper : "clone"});
	}
}

var ClassSocialObj = function()
{
	var main = this;
	main.canvas = null;

	this.init = function()
	{
		main.canvas = window._canvas;
		this.initEvt();
	}

	function getThumbnail(url, thumbWidth, thumbHeight) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var originImage = new Image;
		originImage.onload = function() {
		    ctx.drawImage(originImage, 0, 0);
		};
		originImage.src = url;


		canvas.width = thumbWidth;
		canvas.height = thumbHeight;
		ctx.drawImage(originImage, 0, 0, canvas.width, canvas.height);

		return canvas.toDataURL();
	}

	main.showMyImageTab = function()
	{
		$("#upload_image_area").css("display", "block");
		$("#upload_picasa").css("display", "none");
		$("#upload_flickr").css("display", "none");
		$("#upload_facebook").css("display", "none");
		$("#upload_instagram").css("display", "none");
		$("#album_list_panel").css("display", "none");
		$("#image_list_panel").css("display", "none");
	}

	main.showPicasaTab = function()
	{
		$("#upload_image_area").css("display", "none");
		$("#upload_picasa").css("display", "block");
		$("#upload_flickr").css("display", "none");
		$("#upload_facebook").css("display", "none");
		$("#upload_instagram").css("display", "none");
		$("#album_list_panel").css("display", "none");
		$("#image_list_panel").css("display", "none");
	}

	main.showFlickrTab = function()
	{
		$("#upload_image_area").css("display", "none");
		$("#upload_picasa").css("display", "none");
		$("#upload_flickr").css("display", "block");
		$("#upload_facebook").css("display", "none");
		$("#upload_instagram").css("display", "none");
		$("#album_list_panel").css("display", "none");
		$("#image_list_panel").css("display", "none");
	}

	main.showFacebookTab = function()
	{
		$("#upload_image_area").css("display", "none");
		$("#upload_picasa").css("display", "none");
		$("#upload_flickr").css("display", "none");
		$("#upload_facebook").css("display", "block");
		$("#upload_instagram").css("display", "none");
		$("#album_list_panel").css("display", "none");
		$("#image_list_panel").css("display", "none");
	}

	main.showInstagramTab = function()
	{
		$("#upload_image_area").css("display", "none");
		$("#upload_picasa").css("display", "none");
		$("#upload_flickr").css("display", "none");
		$("#upload_facebook").css("display", "none");
		$("#upload_instagram").css("display", "block");
		$("#album_list_panel").css("display", "none");
		$("#image_list_panel").css("display", "none");
	}


	this.initEvt = function()
	{
		$("#img_skydrive").click(function()
		{
			main.showMyImageTab();
		});
		$("#img_picasa").click(function()
		{
			main.showPicasaTab();
		});
		$("#img_flickr").click(function()
		{
			main.showFlickrTab();
		});
		$("#img_facebook").click(function()
		{
			main.showFacebookTab();
			getFacebookAlbum( function( albumResponse ) {
				$("#album_list_panel").css("display", "block");
				console.log(albumResponse);
				addAlbums_listpanel(albumResponse);
		});
		});
		$("#img_instagram").click(function()
		{
			main.showInstagramTab();
		});
		$(document).on("click", "#getimage_picasa", function()
		{
			var username = document.getElementById("picasa_username").value;
			if(username.length > 0)
				getAlbum_Picasa( username );
		});
		$(document).on("click", "#getimage_flickr", function()
		{
			// var username = document.getElementById("flickr_username").value;
			// if(username.length > 0)
				getAlbum_Flickr( 'yevgenijsokolov' );
		});
		$(document).on("click", "#getimage_facebook", function()
		{
			getFacebookAlbum( function( albumResponse ) {
				$("#upload_facebook").css("display", "none");
				$("#album_list_panel").css("display", "block");
				// var albums = albumResponse.data;
				console.log(albumResponse);
				addAlbums_listpanel(albumResponse);
			});
		});
		$(document).on("click", "#getimage_instagram", function()
		{
			getPhotos_instagram( function( photos ) {
				$("#upload_instagram").css("display", "none");
				$("#image_list_panel").css("display", "block");
				addPhotosAtlistpanel(photos);
			});
		});
	}

	main.init();
}


function changeUserName()
{
	$("#album_list_panel").css("display", "none");
	$("#image_list_panel").css("display", "none");

	var socialObj  = new ClassSocialObj();
	var selID = $("#source_list .sel").attr("id");
	if(selID == "img_skydrive")
	{
		socialObj.showMyImageTab();
	}
	else if(selID == "img_picasa")
	{
		socialObj.showPicasaTab();
	}
	else if(selID == "img_flickr")
	{
		socialObj.showFlickrTab();
	}
	else if(selID == "img_facebook")
	{
		socialObj.showFacebookTab();
	}
	else if(selID == "img_instagram")
	{
		socialObj.showInstagramTab();
	}
	delete socialObj;
}

function backToAllAlbum()
{
	$("#album_list_panel").css("display", "block");
	$("#image_list_panel").css("display", "none");
}