var contentItems = [];
var scrollIndex = 0;
var scroll = 0;

$(document).ready(function() {
    $("#content").children().each(function() {
        contentItems.push($(this).attr("id"));
    })
})

$(window).scroll(function() {
    scroll = $(document).scrollTop(); 
    if(scroll < (0.9*$("#projects").position().top) && scroll >= 0) {
        $("#home_logo").addClass("fade_in_left");
        $("#title_wrapper").addClass("fade_in_right")
        $("#home_logo").removeClass("stay");
        $("#title_wrapper").removeClass("stay");
    } else {
        $("#home_logo").removeClass("fade_in_left");
        $("#title_wrapper").removeClass("fade_in_right");
        $("#home_logo").addClass("stay");
        $("#title_wrapper").addClass("stay");
    }
})