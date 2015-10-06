/*************************************************************************
* Generate each existing element from seed on pageload
**/
$('.preloader__').each(function(index){
	generateLoader(this);
});

/*************************************************************************
* This function can be called to toggle (or create new) preloaders after DOM load
**/
function preload__(parent){
	console.log('preloader called.');
	if ($(parent).has('.loader')){
		var loader = $(parent).find('.loader')[0];
		if($(loader).hasClass('active')){
			$(loader).removeClass('active');
		} else {
			$(loader).addClass('active');
		}
	} else {
		$(parent).append('.loader');
		generateLoader(parent);
		$(parent).find('.loader')[0].addClass('active');
	}
}

/*************************************************************************
* Generator function, can be called to create preloader elements from seed
**/
function generateLoader(seed){
	console.log(seed);
	// retrieve message if exists
	var message = $(seed).attr('data-message');
	// populate loader element
	$(seed).append(
		'<div class="preloader-wrapper big active">'  +
			'<div class="spinner-layer spinner-blue-only">' +
				'<div class="circle-clipper left">' +
					'<div class="circle"></div>' +
				'</div>' +
				'<div class="gap-patch">' +
					'<div class="circle"></div>' +
				'</div>' +
				'<div class="circle-clipper right">' +
					'<div class="circle"></div>' +
				'</div>' +
			'</div>' +
		'</div>');
	if (message){ $(seed).append( '<h5>' + message + '</h5>' ); }
}

/*************************************************************************
* Appending preloader styles to HTML head within <style> tag
**/

var css = '.preloader__ { display: none; } .preloader__.active { display: block; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

head.appendChild(style);
