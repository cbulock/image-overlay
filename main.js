var overlay = {
	rainbow: 'https://storage.googleapis.com/image-overlay/pride.png',
	usa: 'https://storage.googleapis.com/image-overlay/Flag_of_the_United_States.png'
};

var backgroundImage = {};

var setImageFromURL = function ( url ) {
	var image = new Image();
	image.src = url;
	backgroundImage.src = image;
	$getCanvas().trigger('redraw');
}

var setImageFromUpload = function( el ) {
	var reader = new FileReader();
	var image = new Image();
	reader.readAsDataURL(el.files[0]);
	reader.onload = function() {
		image.src = reader.result;
		backgroundImage.src = image;
		$getCanvas().trigger('redraw');
	}
}

var $getCanvas = function() {
	return $('main canvas');
}

var getCanvas = function() {
	return $getCanvas()[0];
}

var setCanvasSize = function(width, height) {
	var canvas = getCanvas();
	canvas.width = width;
	canvas.height = height;
}

var getContext = function() {
	return getCanvas().getContext("2d");
}

var drawImage = function() {
	var ctx = getContext();

	var w = backgroundImage.src.width;
	var h = backgroundImage.src.height;

	setCanvasSize(w, h);
	ctx.clearRect(0, 0, w, h);
	ctx.drawImage(backgroundImage.src, 0, 0);
	drawOverlay($('#overlay').val(), w, h);
}

var drawOverlay = function(name, width, height) {
	var image = new Image();
	var ctx = getContext();

	image.crossOrigin = "Anonymous";
	image.src = overlay[name];

	image.onload = function() {
		ctx.save();
		ctx.globalAlpha = 0.5;
		ctx.drawImage(image, 0, 0, width, height);
		ctx.restore()
		$('#download').attr('href', getCanvas().toDataURL("image/png"));
	}
}

$(function() {
	$getCanvas().on('redraw', drawImage);

	$('main input').change(function() {
		setImageFromUpload(this);
	});

	$('main select').change(function() {
		if (backgroundImage.src) drawImage();
	});

	$('#download').click(function(event) {
		if (this.href === window.location.href ) event.preventDefault();
	}); 

});


