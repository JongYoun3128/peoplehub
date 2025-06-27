// $('.hour_banner_slide_list li').last().prependTo('.hour_banner_slide_list');
// $('.hour_banner_slide_list').css('left', -1200);

// setInterval(function () {
//     $('.hour_banner_slide_list').animate(
//         { left: '-=' + 1200 },
//         'slow',
//         function () {
//             $('.hour_banner_slide_list li')
//                 .first()
//                 .appendTo('.hour_banner_slide_list');
//             $('.hour_banner_slide_list').css('left', -1200);
//         },
//     );
// }, 3000);

$('.hour_left').click(function () {
    $('.hour_banner_slide_list').animate(
        { left: '-=' + 1200 },
        'slow',
        function () {
            $('.hour_banner_slide_list li')
                .first()
                .appendTo('.hour_banner_slide_list');
            $('.hour_banner_slide_list').css('left', -1200);
        },
    );
});

$('.hour_right').click(function () {
    $('.hour_banner_slide_list').animate(
        { right: '-=' + 1200 },
        'slow',
        function () {
            $('.hour_banner_slide_list li')
                .last()
                .prependTo('.hour_banner_slide_list');
            $('.hour_banner_slide_list').css('right', -1200);
        },
    );
});
