function showHideProduct(){
    var lightbox = $('#lightbox');

    if ($(lightbox).hasClass('active')){
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

function populateForm(data, rate) {
    $('.productbox').empty();
    var form = $('#lightbox form');
    var imagebox = $('#lightbox form .imagebox');
    var productBox = $('#lightbox form .productbox');
    var images = data.images;
    var select = data.select;
    var productElements = document.createElement('div');
    var imageElements = document.createElement('div');

    // Generate converted price in AUD from USD
    if (data.discountPrice != "") {
        if (data.discountPrice.indexOf(" - ") > -1){
            var fromto = data.discountPrice.split(" - ");
            var amount = fromto[1]
        } else {
            var amount = data.discountPrice;
        }
    } else if (data.price.indexOf("0.00") !=- 1 ){
        if (data.price.indexOf("US") != -1){
            var unstripped = data.price;
            var amount = unstripped.replace('US $', '');

        } else {
            var amount = data.price;
        }

    }

    console.log('rate: ' + rate + '. amount: ' + amount + '.');
    var price = rate * amount;
    var options;

    // Generate product details
    for (i=0; i < select.length; i++) {
        var optionValues = "";
        var optionType = data.select[i].type;
        console.log(optionType);
        if ((optionType.indexOf('Color') > -1) || (optionType.indexOf('color') != -1)){
            console.log('number of color options: ' + data.select[i].options.length);

            for (l=0; l < data.select[i].options.length; l++) {

                var id = data.select[i].options[l].id;
                var size, image, color;

                if (data.select[i].options[l].labelImage) {
                    var imagedata = (data.select[i].options[l].labelImage);
                    var src = imagedata.replace('.jpg_50x50.jpg', '.jpg');
                    image = '<img src="' + src + '" alt="' + color + '"></img>';
                }

                if (data.select[i].options[l].labelSize) {
                    size = '<input type="text" name="option" value="' + data.select[i].options[l].labelSize + '"></input>';
                }

                if (data.select[i].options[l].labelColor) {
                    color = '<input type="text" name="option" value="' + data.select[i].options[l].labelColor + '"></input>';
                }

                optionValues += '<div class="option">' +
                                    image +
                                    color +
                                    size +
                                    '<input type="hidden" name="option' + j + '" value="[\'' + id + '\', \'' + image + '\']">' +
                                 '</div>';
            }
        } else if ((optionType.indexOf('Size') != -1) || (optionType.indexOf('size') != -1)) {
            console.log('number of size options: ' + data.select[i].options.length);
            for (l=0; l < data.select[i].options.length; l++) {
                var id = data.select[i].options[l].id;
                var size = data.select[i].options[l].labelSize;
                optionValues += '<div class="option">' +
                                    '<input type="text" name="option" value="' + size + '"></input>' +
                                    '<input type="hidden" name="option' + i + '" value="[\'' + id + '\']">' +
                                 '</div>';
            }
        } else {
            optionValues += '<div><h3>Not a recognised option.</h3></div>';
        }

        options += '<div class="option-line">' +
                        '<h3>' +
                            '<input type="text" name = "optionTitle' + i + '" value="' + optionType + '">' +
                        '</h3>' + optionValues +
                     '</div>';
    }

    productElements.innerHTML =
    '<input name="title" class="product-title" value="' + data.name.toString() + '"></input>' +
     options;

     imageElements.innerHTML =
     '<input name="title" class="product-price" value="$' + Math.round(price * 100) / 100 + '"></input>';

    $(productBox).append(productElements);
    $(imagebox).append(imageElements);
}
