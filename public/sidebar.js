$(document).on("click", ".change-size", function () {
  var size = $(this).data("size");
  var increment = parseInt($(this).data("increment"));
  var parentID = $(this).closest(".shirt-size-menu").attr("id"); // Get the ID of the parent container
  var valueToUse = parentID == "shirt-size-menu-1" ? "1" : "2";
  var sizeInput = $("#size" + size + valueToUse); // Update the selector to include the parent ID
  console.log("#size" + size + valueToUse);
  var currentSize = parseInt(sizeInput.text());
  var newSize = currentSize + increment;

  // Ensure the size is not less than 0
  if (newSize < 0) {
    newSize = 0;
  }

  sizeInput.text(newSize);
});

$(document).on("click", ".color-div", function (params) {
  let id = $(this).attr("id");
  $("#shirt-image").attr("src", `./new-images/Front/${id}.png`);
  $("#shirt-image-back").attr("src", `./new-images/Back/${id}.png`);
  $("#frontSide").attr("src", `./new-images/Front/${id}.png`);
  $("#backSide").attr("src", `./new-images/Back/${id}.png`);
  $(".color-div").removeClass("active");
  $(this).addClass("active");

  if (id == "White") {
    $("canvas").css("border-color", "black");
  } else {
    $("canvas").css("border-color", "white");
  }
});
