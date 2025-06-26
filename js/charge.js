$('.tap_list li a').click(function () {
    $(this).parent().addClass('on').siblings().removeClass('on');
});
$('.charge_qna_text_list li').click(function () {
    $(this).find('.charge_qna_text_list_sub_text').slideToggle();
});
