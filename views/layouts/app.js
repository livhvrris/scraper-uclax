$(document).on("click", "#postcomment", function() {

  var thisId = $(this).attr("data-id");

    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        body: $("#usercomment").val()
      }
    })

    .done(function(data) {
      console.log(data);
    });

  $("#usercomment").val("");

});


$(document).on("click", "#delete", function() {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "DELETE",
    url: "/notes/" + thisId,
  })

    .done(function() {
      $("#notes").empty();
    });

});