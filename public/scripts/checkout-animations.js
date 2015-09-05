var link = $('.com__nav-link');
var section = $('.com__section');
var sectionContent = section.find('*');

var switchTab = function() {
	var i  = $(this).attr('data-index');
	var s = section.eq(i);
	var c = s.find('*');

	section.removeClass('active');
	sectionContent.removeAttr('style');
	s.addClass('active');

	c.css({
		transform: 'none',
		opacity: 1
	});

	return false;
};

link.on('click', switchTab);

function activeFirst(stage) {
	if (stage && stage < 4) {
		console.log(stage);
		$(section[stage - 1]).addClass('active');
		$(section[stage - 1]).find('*').css({
			transform: 'none',
			opacity: 1
		});
	} else {
		section.first().addClass('active');
		section.first().find('*').css({
			transform: 'none',
			opacity: 1
		});
	}
}
