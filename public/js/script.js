var contentItems = [];
var scrollIndex = 0;
var scroll = 0;

var repoLangs = {};
var repos = [];

$(document).ready(function() {
    $("#content").children().each(function() {
        contentItems.push($(this).attr("id"));
    })
    getRepos(repos);
    getRepoLanguages();
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

function getRepos(list) {
    $.ajax({
        type: "GET",
        url: "/api/github-repos",
        contentType: 'application/json',
        success: function(data) {
            for(var i = 0; i < data.length; i++) {
                list.push(data[i]["name"]);
            }
        }
    })
}

function getRepoLanguages() {
    $.ajax({
        type: "GET",
        url: "/api/github-repos-lang",
        contentType: 'application/json',
        success: function(data) {
            
            createRepoGraphic(data["repo_count"], data["repos"]);
        }
    })
}

function createRepoGraphic(repoCount, repoLangs) {
    var colors = ["#C0392B", "#5B2C6F", "#2980B9", "#48C9B0", "#1E8449", "#F1C40F", "#F39C12", "#BA4A00", "#283747"];
    var langCount = getRepoLangCount(repoLangs);
    var sortedRepos = sortRepo(repoLangs);
    for(var counter in sortedRepos) {
        var randColor = colors[counter];
        var percentage = (sortedRepos[counter][1].length/langCount) * 100;
        console.log(percentage);
        var divTag = `<div class="bar_part" style="--color:${randColor}; --percentage:${percentage};"><div class="bar_part_text">${sortedRepos[counter][0]}</div></div>`
        $("#bar_projects").append(divTag); 
        console.log(divTag); 
    }
}

function getRepoLangCount(repoLangs) {
    var counter = 0;
    for(var key in repoLangs) {
        counter += repoLangs[key].length;
    }
    console.log(counter);
    return counter;
}

function sortRepo(repoLangs) {
    var sortable = [];
    for(var key in repoLangs) {
        if(repoLangs.hasOwnProperty(key)) {
            sortable.push([key, repoLangs[key]]);
        }
    }
    sortable.sort(function(a,b) {
        return b[1].length - a[1].length;
    })
    return sortable;
}