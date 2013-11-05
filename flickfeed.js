(function(w, d) {
	function Flickfeed(options) {
		if (this === w) {
			return new arguments.callee(options);
		}
		this.images = [];
		this.imageData = [];
		this.run();
	}

	Flickfeed.prototype.run = function() {
		var x = new XMLHttpRequest();
		x.open("GET", this.buildURL(), true);
		x.onreadystatechange = function() {
			if (x.readyState == 4) {
				this.parse(JSON.parse(x.responseText));
			}
		}.bind(this);
		x.send();
	};

	Flickfeed.prototype.parse = function(data) {
		if (data.photos) {
			this.imageData = data.photos.photo;
			this.processImages();
		}
	};

	Flickfeed.prototype.processImages = function() {
		this.imageData.forEach(function(img) {
			this.images.push(this.buildImageUrl(img));
		}.bind(this));
		this.output();
	};

	Flickfeed.prototype.output = function(){
		var div = document.createElement('div');
		this.images.forEach(function(image){
			var img = new Image();
			img.src = image;
			div.appendChild(img);
		});
		d.body.appendChild(div);
	};

	Flickfeed.prototype.ApiConfig = {
		root: "http://api.flickr.com/services/rest/?",
		method: "flickr.photos.search",
		ApiKey: "bf1842074c9c69fbc9d2a080569ae2ff",
		UserId: "59597329%40N08",
		format: "json",
		extras: ["nojsoncallback=1"]
	};

	Flickfeed.prototype.buildURL = function() {
		var url = this.ApiConfig.root + "method=" + this.ApiConfig.method + "&api_key=" + this.ApiConfig.ApiKey + "&user_id=" + this.ApiConfig.UserId + "&format=" + this.ApiConfig.format + '&' + this.ApiConfig.extras.join('&');
		return url;
	};

	Flickfeed.prototype.buildImageUrl = function(image) {
		var url = "http://farm" + image.farm + ".staticflickr.com/" + image.server + "/" + image.id + "_" + image.secret + "_z.jpg";
		return url;
	};

	w.Flickfeed = Flickfeed;

})(window, document);