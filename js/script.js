$(document).ready(function () {

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            $(this).parent().parent().find(".navigationItem").find("a").removeClass("active");
            $(this).addClass("active");
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    $("#btnFinEnce").click(function () {
        window.location.href = "https://github.com/DonkeyCo/finEnce";
    });

    $(window).on('mousewheel', function () {
        $('.target').each(function () {
            if ($(window).scrollTop() >= $(this).offset().top - $(".header").height()) {
                var href = $(this).attr('id');
                $("#navigation .navigationItem a").removeClass("active");
                $("#navigation .navigationItem a[href='#" + href + "']").addClass("active");
            }
        });
    });

    $("#footer").click(function() {
        alert("Why'd you click here?");
    });
});