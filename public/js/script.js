var contentItems = [];
var scrollIndex = 0;
var scroll = 0;

$(document).ready(function() {
    $("#content").children().each(function() {
        contentItems.push($(this).attr("id"));
    })
    var repos = getRepos();
    var repoLangs = getRepoLanguages(repos);
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

function getRepos() {
    var list = [];
    $.ajax({
        type: "GET",
        url: "/api/github-repos",
        async: false,
        contentType: 'application/json',
        success: function(data) {
            for(var i = 0; i < data.length; i++) {
                list.push(data[i]["name"]);
            }
        }
    })
    return list;
}

function getRepoLanguages(repos) {
    var list = [];
    for(var i = 0; i < repos.length; i++) {
        $.ajax({
            type: "GET",
            url: "/api/github-repo-lang",
            contentType: 'application/json',
            data: {
                name: repos[i]
            },
            success: function(data) {
                var keys = Object.keys(data);
                for(var j = 0; j < keys.length; j++) {
                    if(list.indexOf(keys[j]) > -1) {
                        list[keys[j]].push(repos[i]);
                    } else {
                        list[keys[j]] = [repos[i]]
                    }
                }
            }
        })
    }
}