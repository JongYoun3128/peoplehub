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

$('.enterprise_solution_slide_list li')
    .last()
    .prependTo('.enterprise_solution_slide_list');
$('.enterprise_solution_slide_list').css('left', -1100);

$('.solution_arrow').click(function () {
    $('.enterprise_solution_slide_list').animate(
        { left: '-=' + 1100 },
        'slow',
        function () {
            $('.enterprise_solution_slide_list li')
                .first()
                .appendTo('.enterprise_solution_slide_list');
            $('.enterprise_solution_slide_list').css('left', -1100);
        },
    );
});
