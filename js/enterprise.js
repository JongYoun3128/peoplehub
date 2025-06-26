$('.enterprise_brand_content_list li')
    .last()
    .prependTo('.enterprise_brand_content_list');
$('.enterprise_brand_content_list').css('left', -1300);

$('.arrow').click(function () {
    $('.enterprise_brand_content_list').animate(
        { left: '-=' + 1300 },
        'slow',
        function () {
            $('.enterprise_brand_content_list li')
                .first()
                .appendTo('.enterprise_brand_content_list');
            $('.enterprise_brand_content_list').css('left', -1300);
        },
    );
});
