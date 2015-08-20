function showHideProduct(){
    var lightbox = $('#lightbox');

    if ($(lightbox).hasClass('active')){

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
    console.log(JSON.stringify(data));

    var form = $('#lightbox form');
    var imagebox = $('#lightbox form .imagebox');
    var productBox = $('#lightbox form .product');
    var images = data.images;
    var select = data.select;
    var productElements = document.createElement('div');
    var imageElements = document.createElement('div');

    if (data.discountPrice != "") {
        var amount = data.discountPrice;
    } else if (data.price.indexOf("0.00") ==-1 ){
        if (data.price.indexOf("US") != -1){
            var unstripped = data.price;
            var amount = unstripped.replace('US $', '');

        } else {
            var amount = data.price;
        }

    }

    var price = rate * amount;
    for (i=0; i < select.length; i++) {
        var options;
        var optionType = data.select[i].type;
        var optionValues;

        if (optionType.indexOf('color') == -1){
            for (l=0; l < data.select[i].options.length; l++) {
                var id = data.select[i].options[l].id;
                var color = data.select[i].options[l].labelColor;
                var image = data.select[i].options[l].labelImage;
                optionValues += '<div>' +
                    '<img src="' + image.replace('.jpg_50x50.jpg', '.jpg') + '"></img>' +
                    '<input type="checkbox" name="vehicle" value="[\'' + id + '\', \'' + color + '\', \'' + image + '\',]"><p>' + color + '</p><br>'
                    '</div>';
            }
        } else {
            for (l=0; l < data.select[i].options.length; l++) {
                var id = data.select[i].options[l].id;
                var size = data.select[i].options[l].labelSize;
                var image = data.select[i].options[l].labelImage;
                optionValues += '<div>' +
                    '<img src="' + image.replace('.jpg_50x50.jpg', '.jpg') + '"></img>' +
                    '<input type="checkbox" name="vehicle" value="[\'' + id + '\', \'' + size + '\', \'' + image + '\',]"><p>' + color + '</p><br>'
                    '</div>';
            }
        }
        options += '<div>' +
            '<h3>' + optionType + '</h3>' +
            + optionValues +
            '</div>';
    }

    productElements.innerHTML =
    '<input name="title" class="product-title" value="' + data.name + '"></input>' +
    '<input name="title" class="product-title" value="$' + price + '"></input>' +
     options;


    $(productBox).append(productElements);
}
