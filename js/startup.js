$('.startup_slide_list li').last().prependTo('.startup_slide_list');
$('.startup_slide_list').css('left', -1240);

setInterval(function () {
    $('.startup_slide_list').animate(
        { left: '-=' + 1240 },
        'slow',
        function () {
            $('.startup_slide_list li').first().appendTo('.startup_slide_list');
            $('.startup_slide_list').css('left', -1240);
        },
    );
}, 3000);
