function showHideProduct(){
	var lightbox = $('#lightbox');

	if ($(lightbox).hasClass('active')){
		$('.imagebox').empty();
		$('.productbox').empty();
		$('#lightbox').css({
			display: 'none'
		});
		$(lightbox).removeClass('active');

	} else {

		$('#lightbox').css({
			display: 'block'
		});

		$('#lightbox .loading').css({
			display: 'block'
		});

		$(lightbox).addClass('active');
	}
}

function showHideGrid(){
	var grid = $('#grid-content');
	var loader = $('#grid-content > .loading');
	if ($(grid).hasClass('active')) {
		// TODO: style deletion of elements to be directional and heirarchial.
		$(grid).on('hidden.zmd.hierarchicalDisplay', function () {
			$(grid).empty();
		});

		$(grid).hierarchicalDisplay('toggle');

		$(loader).css({ display: 'block' });
		$(grid).removeClass('active');

	} else {
		console.log('hideShow called.');

		$(grid).hierarchicalDisplay('toggle');
	}
}

function squareImages(){
	console.log('running shit');
	var images = $('.item-img');
	for (i= 0; i < images.length; i++) {
		var height = $(images[i]).width();
		$(images[i]).css({
			height: height
		});
	}

	var prices = $('.item-price');
	for (j = 0; j < prices.length; j++) {
		var temp = $(prices[j]).text().replace('US', '');
		$(prices[j]).text(temp)
	}
}

function deleteElement(element) {
  $(element).remove();
}

function cleanSpaces(input){
	var raw = input + '';
	var cleaned = raw.replace(' ', '');
	return cleaned;
}

function separateLabel(input){
	var raw = input + '';
	var separated = raw.split(':');
	var lastIndex = (separated.length - 1);
	var value = separated[lastIndex];
	// Checks if sizing is Asian standard, otherwise European.

	return value;
}

function adjustSize(input){
	var asian = input;
	switch(asian) {
		case 'S':
			return 'XXS';
			break;
		case 'M':
			return 'XS';
			break;
		case 'L':
			return 'S';
			break;
		case 'XL':
			return 'M';
			break;
		case 'XXL':
			return 'L';
			break;
		case 'XXXL':
			return 'XL';
			break;
		case '4XL':
			return 'XXL';
			break;
		case 'XXXXL':
			return 'XXL';
			break;
	}
}

function populateForm(data, rate, link) {

	// Set up data structure
	var form = $('#lightbox form');
	var imagebox = $('#lightbox form .imagebox');
	var productBox = $('#lightbox form .productbox');
	var sizing = 'asian';

	// Set up variables
	var images = (data.imagePrimary).concat(data.imageSecondary), select = data.select, tagsdata = data.tags;
	var options = '', imageGrid = '', tags = '', price, category = '', sex = '';

	// Set up element containers
	var productElements = document.createElement('div');
	var imageElements = document.createElement('div');

	// Generate converted price in AUD from USD
	if ((data.discountPrice) && (typeof data.discountPrice != 'undefined')) {
		console.log('price is discounted: ' + data.discountPrice);
		if (data.discountPrice.indexOf(" - ") > -1){
			var fromto = data.discountPrice.split(" - ");
			var amount = fromto[1]
		} else {
			var amount = data.discountPrice;
		}
	} else if (data.multiPrice) {
		console.log('price is multi: ' + data.multiPrice);
		var input = data.multiPrice + '';
		var separated = input.split(' - ');
		var lastIndex = (separated.length - 1);
		var amount = separated[lastIndex];

	} else if (data.price) {
		console.log('price is standard: ' + data.price);
		if (data.price.indexOf("US") != -1){
			var unstripped = data.price;
			var amount = unstripped.replace('US $', '');
		} else {
			var amount = data.price;
		}

	}

	// Declare price
	price = rate * amount;

	// Generate product details
	// GENERATE TAGS
	for (y=0; y < tagsdata.length; y++) {

		// CREATE INDIVIDUAL TAG & INPUT

		var content = tagsdata[y].content;
		var label = separateLabel(tagsdata[y].label);

		tag = '<input type="text" name="tags[]" value="' + label + content + '">';

		// Append individual tag to tags object
		tags +=
		'<div class="tag-line" id="tag-identifier-' + y + '">' +
				'<i class="material-icons delete-option" onclick="deleteElement(\'#tag-identifier-' + y + '\')">&#xE872;</i>' +
				tag +
		'</div>';
	}


	// FOR EACH OPTION TYPE
	for (i=0; i < select.length; i++) {
		var optionValues = "";
		var optionType = select[i].type;
		// CHECK FOR TYPE AND CREATE OPTIONS
		if ((optionType.indexOf('Color') > -1) || (optionType.indexOf('color') != -1)){
			// Add option name
			optionValues += '<input type="hidden" name="option[' + i + '][0]" value="color">';
			for (l=0; l < select[i].options.length; l++) {

				var id = select[i].options[l].id;
				var size = '', image = '', imgsrc = '', color = '';

				if (select[i].options[l].labelImage) {
					var imagedata = (select[i].options[l].labelImage);
					var src = imagedata.replace('.jpg_50x50.jpg', '.jpg');
					image = '<img src="' + src + '" alt="' + color + '"></img><input type="hidden" name="option[' + i + '][1][' + l + '][image]" value="' + imagedata + '"></input>';
				}

				if (select[i].options[l].labelSize) {
					size = '<input type="text" name="option[' + i + '][1][' + l + '][label]" value="' + select[i].options[l].labelSize + '"></input>';
				}

				if (select[i].options[l].labelColor) {
					color = '<input type="text" name="option[' + i + '][1][' + l + '][label]" value="' + select[i].options[l].labelColor + '"></input>';
				}

				optionValues += '<div class="option" id="option-line-' + i + '-' + l + '">' +
									image +
									color +
									size +
									'<input type="hidden" name="option[' + i + '][1][' + l + '][id]" value="' + id + '">' +
									'<i class="material-icons delete-option" onClick="deleteElement(\'#option-line-' + i + '-' + l + '\')">&#xE872;</i>' +
								 '</div>';
			}
		} else if ((optionType.indexOf('Size') != -1) || (optionType.indexOf('size') != -1)) {
			optionValues += '<input type="hidden" name="option[' + i + '][0]" value="size">';
			for (l=0; l < select[i].options.length; l++) {
				var id = select[i].options[l].id;
				var rawSize = cleanSpaces(select[i].options[l].labelSize);
				var size = adjustSize(rawSize);
				// call adjustment function
				optionValues += '<div class="option" id="option-line-' + i + '-' + l + '">' +
									'<input type="text" name="option[' + i + '][1][' + l + '][label]" value="' + size + '"></input>' +
									'<input type="hidden" name="option[' + i + '][1][' + l + '][id]" value="' + id + '">' +
									'<i class="material-icons delete-option" onClick="deleteElement(\'#option-line-' + i + '-' + l + '\')">&#xE872;</i>' +
								 '</div>';
			}
		} else {
			optionValues += '<div><h3>Not a recognised option.</h3></div>';
		}

		console.log('Sizing recognised as: ' + sizing);

		options +=
		'<div class="option-line" id="option-identifier-' + i + '">' +
			'<h3>' +
				'<i class="material-icons delete-option" onClick="deleteElement(\'#option-identifier-' + i + '\')">&#xE872;</i>' +
			'</h3>' + optionValues +
		'</div>';
	}

	// GENERATE IMAGE GRID
	for (x=0; x < images.length; x++) {

		// CREATE INDIVIDUAL IMAGE & INPUT

		var imagedata = images[x];
		var src = imagedata.replace('.jpg_50x50.jpg', '.jpg');
		imagelink = '<img src="' + src + '"></img>';
		imagedata = '<input type="hidden" name="images[]" value="' + src + '">';

		imageGrid +=
		'<div class="image-line" id="image-identifier-' + x + '">' +
				'<i class="material-icons delete-option" onclick="deleteElement(\'#image-identifier-' + x + '\')">&#xE872;</i>' +
				imagelink +
				imagedata +
		'</div>';
	}

	// GENERATE CATEGORY SELECTION

	var activenav = $('.grid-nav li a.active').attr('data-category');
	var IFH = "", IFMS = "", IFMJ = "", IFMA = "", IFMW = "", IFWS = "", IFWJ = "", IFWD = "", IFWA = "", IFWW = "";
	switch(activenav) {
		case 'H': //Home
			IFH = 'selected';
			break;

		case 'MS': // Male shirts
			IFMS = 'selected';
			break;

		case 'MJ': // Male Jackets
			IFMJ = 'selected';
			break;

		case 'MA': // Male Accessories
			IFMA = 'selected';
			break;

		case 'MW': // Male Watches
			IFMW = 'selected';
			break;

		case 'WS': // Female Shirts
			IFWS = 'selected';
			break;

		case 'WJ': // Female Jackets
			IFWJ = 'selected';
			break;

		case 'WD': // Female Dresses
			IFWD = 'selected';
			break;

		case 'WA': // Female Accessories
			IFWA = 'selected';
			break;

		case 'WW': // Female Watches
			IFWW = 'selected';
			break;

		default: // None Applicable
			console.log('Err: no applicable category.')
			break;
	}

	sex +=
	'<select name="sex">' +
		'<option value="Man" ' + IFMS + IFMJ + IFMA + IFMW + '>Man</option>' +
		'<option value="Woman" ' + IFWS +  IFWD + IFWJ + IFWA + IFWW + '>Woman</option>' +
	'</select>';

	category +=
	'<select name="category">' +
		'<option value="Dresses" ' + IFWD + '>Dresses</option>' +
		'<option value="Shirts" ' + IFMS +  IFWS +'>Shirts</option>' +
		'<option value="Jackets" ' + IFMJ +  IFWJ +'>Jackets</option>' +
		'<option value="Accessories" ' + IFMA +  IFWA +'>Accessories</option>' +
		'<option value="Watches" ' + IFMW +  IFWW +'>Watches</option>' +
	'</select>';


	// Fill element containers
	productElements.innerHTML =
	'<a target="_blank" href="' + link + '"><i class="material-icons page-link">link</i></a>' +
	'<input name="title" class="product-title" value="' + data.name + '" />' +
	'<h3 class="accordion-title">Tags<i href="#product-tags" class="fa fa-chevron-up accordion-button"></i></h3>' +
	'<div class="accordion-section active" id="product-tags">'+
		tags +
	'</div>' +
	'<h3 class="accordion-title">Options<i href="#product-options" class="fa fa-chevron-down accordion-button"></i></h3>' +
	'<div class="accordion-section" id="product-options">'+
		options +
	 '</div>';

	 imageElements.innerHTML =
	 '<input name="defaultimage" type="hidden" id="defaultImage" value="" />' +
	 imageGrid +
	 '<div class="product-highlights">' +
		'<input name="price" class="product-price" value="$' + Math.round(price * 100) / 100 + '" />' +
		'<input name="rating" class="product-rating" value="' + data.rating + '" />' +
		 sex +
		 category +
	 '</div>';

	 // Populate page with element containers
	 $(productBox).append(productElements);
	 $(imagebox).append(imageElements);
}

$(document).ready(function(){
	function deactivateAccordions(){
		$('.accordion-title i').removeClass('fa-chevron-up');
		$('.accordion-title i').addClass('fa-chevron-down');
		$('.accordion-section').slideUp('500');
		$('.accordion-section').removeClass('active');
	}

	$('.view-product').on('click', '.accordion-button', function(){
		var button = $(this);
		var target = $(button).attr('href');

		if ($(target).hasClass('active')){
			// deactivate
			deactivateAccordions();
		} else {
			//activate
			deactivateAccordions();

			$(button).removeClass('fa-chevron-down');
			$(button).addClass('fa-chevron-up');
			$(target).slideDown('500');
			$(target).addClass('active');
		}
	});
});
