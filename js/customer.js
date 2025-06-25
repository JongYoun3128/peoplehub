$('.customer_qna_list li a').click(function () {
    $(this).parent().addClass('active').siblings().removeClass('active');
});
$('.qna_sub_list li').click(function () {
    $(this).find('.sub_text').slideToggle();
});
