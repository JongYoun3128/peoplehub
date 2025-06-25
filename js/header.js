$('.header_menu_service').click(function () {
    $('.sub_menu_box').slideToggle();
    $('.solution_menu').slideUp();
    $('.resources_menu').slideUp();
});

$('.header_menu_solution').click(function () {
    $('.solution_menu').slideToggle();
    $('.sub_menu_box').slideUp();
    $('.resources_menu').slideUp();
});

$('.header_menu_resources').click(function () {
    $('.resources_menu').slideToggle();
    $('.solution_menu').slideUp();
    $('.sub_menu_box').slideUp();
});
