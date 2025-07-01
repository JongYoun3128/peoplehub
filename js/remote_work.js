$('.remote_brand_list li').last().prependTo('.remote_brand_list');
$('.remote_brand_list').css('left', -1000);

setInterval(function () {
    $('.remote_brand_list').animate({ left: '-=' + 1000 }, 'slow', function () {
        $('.remote_brand_list li').first().appendTo('.remote_brand_list');
        $('.remote_brand_list').css('left', -1000);
    });
}, 3000);
