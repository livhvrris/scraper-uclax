$.getJSON("/articles", function(data) {

  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }

});


$(document).on("click", "#startscrape", function() {

  $.ajax({
    method: "GET",
    url: "/scrape",
  })

    .done(function() {
      console.log("NYT article scrape was successful!")
    });

});


$(document).on("click", "#deletenote", function() {

  var thisId = $(this).attr("data-id");


  $.ajax({
    method: "DELETE",
    url: "/notes/" + thisId,
  })

    .done(function() {
      console.log("You've successfully deleted this note!")
    });

});
