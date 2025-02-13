$(document).ready(function(){
    //Tworzenie wektorów z danymi do slajdów
    var slideArray = ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"];
    var textArray = ["Kobieta w deszczu", "Nad morzem", "Buzia", "Kałuża"];
    var urlArray = ["http://www.interia.pl", "http://www.wp.pl", "http://www.onet.pl", "http://www.gazeta.pl"];
    var lenArray = slideArray.length;
    var slideWidth=400;
    var slideContainer = slideWidth * lenArray;
    var timeAnimation = 1000;

    $('.img_container').append('<div class="slide-container"/>');
    $('.img_container').after('<ul id="nav" class="clearfix"> </ul>');

    for(i=0; i<lenArray; i++) {
        var slideNum = i + 1;
        $('#nav').append('<li><a href="#" rel="' + slideNum + '">' + slideNum + '</a></li>');

        var slideInfo = '<div class="slide-image' + slideNum + ' slides">';
        slideInfo+='<a href="' + urlArray[i] + '"><div class="slide-text activeInfo"' + [i] +'>'+textArray[i] + '</div><img src="images/' + slideArray[i] + '"></a></div>';

        $('.slide-container').append(slideInfo);
    }

    $(".slide-container").css({'width': slideContainer});


    $('#nav li a').bind('click', function(){
        $('#nav li a').removeClass('active');
        $(this).addClass('active');
        $('.slide-text').css({'right':'0px', 'top': '-100px'});
        $('.slide-text').stop();
        $('.slide-text').clearQueue();

        var active = $('#nav li a.active').attr('rel')-1;
        var slidePosition = active * slideWidth;
        var slideNum = $('#nav li a.active').attr('rel');
    
        $('.slide-container').animate({
            left:-slidePosition}, timeAnimation, function() {
                $('.slide-image'+slideNum+' .slide-text').addClass('textStrip').animate({
                    left:slidePosition, top:0, right:0}, timeAnimation, function(){
                        $('.slide-text').delay(3000).animate({top:-100}, timeAnimation);
                    });
            });
    });
});