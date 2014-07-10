
$(document).ready(function () {

	console.log('hola!')
	/*
	$('#slider').rhinoslider({
		effect: 'fade',
		showTime: 5000,
		autoPlay: true
	});*/
	/*
    window.myFlux = $('#slider').flux({
        autoplay: false,
        pagination: true
    });*/
	
				window.f = new flux.slider('#slider', {
        			autoplay: true
        			//pagination: true,
        			//controls : true
        			//pagination: true
				});

	//menu()
	/*
	modal()

	var container = document.getElementById('piece-furniture-3D')

	draw_3D_Object(container, 'mesa')
	*/
})