$(document).ready(function() {
    $('#fileInput').on('change', function(event) {
        var file = event.target.files[0];
        if(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var content = e.target.result;
                var newsArray = content.split('\n')
                var newsLength = newsArray.length;
                var newsInterval = 3000;

                $('h2').after('<ul id="news-feed"></ul>')
                for(i=0; i<newsLength; i++){
                    $('#news-feed').append('<li>'+newsArray[i]+'</li>');
                }

                function slideArticle(){
                    $('#news-feed li:last').clone().prependTo('#news-feed').css('display','none');
                    $('news-feed li:first').fadeIn(1000, function(){
                        $(this).css('background-color',"#45c4f6").delay(1000).slideDown('fast', function(){
                            $(this).css('background-color',"#45c4f6");
                        });
                    });
                    $('#news-feed li:last').fadeOut().remove();
                }
                setInterval(slideArticle,newsInterval);   
            }
            reader.readAsText(file);
        } else{
            $('#fileInput').text('Brak pliku...')
        }
    });
});
