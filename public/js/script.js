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

    $("body").on("click", ".bar_part", function(event) {
        var id = $(this).attr("id");
        var l = findRepos(id, repoLangs);
        createDetailGraphic(l);
    });
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

function createRepoGraphic(repoCount, repos) {
    var langCount = getRepoLangCount(repos);
    repoLangs = sortRepo(repos);
    console.log(repoLangs);
    for(var counter in repoLangs) {
        color = getColor();
        var percentage = (repoLangs[counter][1].length/langCount) * 100;
        var divTag = `<div id="${repoLangs[counter][0]}" class="bar_part" style="--color:${color}; --percentage:${percentage};"><span class="bar_part_text">${repoLangs[counter][0]}</span></div>`
        $("#bar_projects").append(divTag); 
    }
}

function getRepoLangCount(repoLangs) {
    var counter = 0;
    for(var key in repoLangs) {
        counter += repoLangs[key].length;
    }
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

function findRepos(lang, l) {
    for(var it in l) {
        if(l[it][0].toLocaleLowerCase().localeCompare(lang.toLocaleLowerCase()) == 0) {
            return l[it][1];
        }
    }
}

function createDetailGraphic(list) {
    var percentage = 1/list.length * 100;
    $("#bar_details").empty();
    for(var i in list) {
        color = getColor();
        var divTag = `<div id="${list[i]}" class="bar_details_part" style="--color:${color}; --percentage:${percentage};"><span class="bar_part_text">${list[i]}</span></div>`;
        $("#bar_details").addClass("fold_l_r");
        $("#bar_details").append(divTag);
        $("body").on('animationend webkitAnimationEnd oAnimationEnd', '#bar_details', function(e) {
            $("#bar_details").removeClass("fold_l_r");
        });
    }
}

function getColor() {
    var hex = Math.floor(Math.random()*16777215).toString(16);
    var color = ('000000' + hex).slice(-6);
    color = ColorLuminance(hex, -0.15);
    return color;
}

function ColorLuminance(hex, lum) {
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}