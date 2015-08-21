function getRate(callback) {

    // set endpoint and your access key
    endpoint = 'convert';
    access_key = '4f0821b1ca6a1d19d8cd8c681cf3e1bd';

    // define from currency, to currency, and amount
    from = 'USD';
    to = 'AUD';

    // execute the conversion using the "convert" endpoint:
    $.ajax({
        url: 'http://www.apilayer.net/api/live?access_key=4f0821b1ca6a1d19d8cd8c681cf3e1bd',
        dataType: 'jsonp',
        success: function(json) {

            // access the conversion result in json.result
            var usdAud = json.quotes.USDAUD;
            callback(usdAud);
        }
    });
};
