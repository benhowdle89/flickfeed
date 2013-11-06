(function(w, d) {
	function Flickfeed(options) {
		if (this === w) {
			return new Flickfeed(options);
		}
		this.options = options || {};
		this.settings = {};
		for (var i in this.defaults) {
			this.settings[i] = this.options[i] || this.defaults[i];
		}
		this.settings.userId = this.options.userId;
		if (!this.settings.userId) {
			throw new Error("A valid user ID needs to be passed in");
		}
		this.images = [];
		this.imageData = [];
		this.setElement();
		if (!this.element) {
			throw new Error("Can\'t find a valid element");
		}
		this.run();
	}

	Flickfeed.prototype.run = function() {
		var x = new XMLHttpRequest();
		x.open("GET", this.buildURL(), true);
		x.onreadystatechange = function() {
			if (x.readyState == 4) {
				if (x.responseText) {
					this.parse(JSON.parse(x.responseText));
				} else {
					throw new Error("An unknown error occurred");
				}
			}
		}.bind(this);
		x.send();
	};

	Flickfeed.prototype.setElement = function() {
		var target = this.options.target || "#Flickfeed";
		this.element = d.querySelector(target);
	};

	Flickfeed.prototype.parse = function(data) {
		if (data.photos) {
			this.imageData = data.photos.photo;
			this.processImages();
		} else {
			if (data.code) {
				throw new Error(data.message);
			} else {
				throw new Error("An unknown error occurred");
			}
		}
	};

	Flickfeed.prototype.processImages = function() {
		for (var i = this.imageData.length - 1; i >= 0; i--) {
			this.images.push(this.buildImageUrl(this.imageData[i]));
		}
		this.output();
	};

	Flickfeed.prototype.output = function() {
		var fragment = d.createDocumentFragment();
		for (var i = this.images.length - 1; i >= 0; i--) {
			var img = new Image();
			img.src = this.images[i];
			img.className = 'Flickfeed-image';
			fragment.appendChild(img);
		}
		this.element.appendChild(fragment);
	};

	Flickfeed.prototype.ApiConfig = {
		root: "http://api.flickr.com/services/rest/",
		method: "flickr.photos.search",
		ApiKey: "bf1842074c9c69fbc9d2a080569ae2ff",
		format: "json",
		extras: ["nojsoncallback=1"]
	};

	Flickfeed.prototype.defaults = {
		limit: 10,
		size: "m",
		sort: "date-posted-desc"
	};

	Flickfeed.prototype.buildURL = function() {
		var url = this.ApiConfig.root + "?method=" + this.ApiConfig.method + "&api_key=" + this.ApiConfig.ApiKey + "&user_id=" + this.settings.userId + "&format=" + this.ApiConfig.format + '&sort=' + this.settings.sort + '&per_page=' + this.settings.limit + '&' + this.ApiConfig.extras.join('&');
		return url;
	};

	Flickfeed.prototype.buildImageUrl = function(image) {
		var url = "http://farm" + image.farm + ".staticflickr.com/" + image.server + "/" + image.id + "_" + image.secret + "_" + this.settings.size + ".jpg";
		return url;
	};

	w.Flickfeed = Flickfeed;

})(window, document);