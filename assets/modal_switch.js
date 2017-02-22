//load image - screenshot of os - detect browser os

var incrementScoreVar = 0; //reference for hooking up backend
var wallpaper; // will be used in css image-background property for the user to download
//on load, the z-index of the image will be below the overlay. the confirm dialog will bring the image up to be available to a contextmenu in a taphold event

$("#tobedownloaded").click(function (e) {
  var imageZshift = 'position:fixed;top:0px;left:0px;width:100%;height:100%;z-index:1;';
  var img = $(this);
  img.attr("style", imageZshift);
//	$("#closeIMG").attr("style", "z-index:1;");
  //waiting on backend implementation here; refer to older versions for ajax call here
  apiClient.onDownloadFile = function (data) {
    if (data.success) {
      apiClient.close();
    }
  };
  apiClient.downloadFile(img.attr('src'));
});

//understanding the instructions, user presses "next":
$("#introNextBTN").click(function (e) {
  $("#intro").css("visibility", "hidden");
  $("#gameModal").css("visibility", "visible");
  $("li a.DLimg").css("visibility", "visible");
});
//download link on selected carousel image
$(".DLimg").click(function (event) {
  wallpaper = $(this).parent().find("img").attr("src");
  $("#gameModal").css("visibility", "hidden"); //hide modal to show new modal
  $("#wallpaperModal").attr("style", "visibility:visible; padding-top: 73px; padding-bottom: 54px;");
  $("#tobedownloaded").attr("src", wallpaper);

  $("li a.DLimg").css("visibility", "hidden");
//	$(".bg").css("visibility", "hidden");
});

//pressing "got it" on instructions page:
$("#gotitBTN").click(function () {
  $("#instructions").css("visibility", "hidden");
  $("#wallpaperModal").attr("style", "visibility:visible; padding-top: 73px; padding-bottom: 54px;");
  $("#tobedownloaded").attr("src", wallpaper);

});

var modal = document.getElementById('instructions');
$(".DLimg").click(function () {
  $("#instructions").css("display", "block");
  //check for user os
  var isMac = /(mac)/i.test(navigator.userAgent);
  var isAndroid = /(android)/i.test(navigator.userAgent);
  if (isMac) {
    $("#iosPhoto").css("display", "inline");
  }
  else if (isAndroid) {
    $("#androidPhoto").css("display", "inline");
  }
  else {
    //
  }

});

$(window).click(function (e) {
  if (e.target == modal) modal.style.display = "none";
})
$("#gotIt").click(function () {
  modal.style.display = "none";
});
