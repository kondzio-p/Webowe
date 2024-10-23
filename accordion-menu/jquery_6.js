$(document).ready(function(){
	
	$('.accordion-content').not(':first').hide();
	
	$('.accordion-content:first').show();
	$('.accordion-header:first').addClass('header-active');	
	$('.accordion-header:first').find('span').addClass('icon-active');

	$('.accordion-header').click(function () {
		$('.accordion-content:visible').slideUp('slow').prev().removeClass('header-active');
		$('.icon-active:visible').removeClass('icon-active');
		$(this).addClass('header-active').next().slideDown('slow');
		$(this).find('span').addClass('icon-active');
	});
	
  }); 