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
		this.settings.userId = this.options.userId || null;
		this.settings.groupId = this.options.group_id || null;
		if (!this.settings.userId && !this.settings.groupId) {
			throw new Error("One valid ID needs to be passed in");
		}
		this.images = [];
		this.imageData = [];
		this.success = this.options.success || null;
		this.complete = this.options.complete || null;
		this.template = this.options.template || null;
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
		if (this.success && typeof this.success === 'function') {
			this.success(this.images);
		} else {
			this.output();
		}
	};

	Flickfeed.prototype.output = function() {
		var finished = function() {
			if (this.complete && typeof this.complete === 'function') {
				this.complete();
			}
		}.bind(this);

		if (this.template && typeof this.template === 'string') {
			this.element.innerHTML = this.compileTemplate();
			finished();
		} else {
			var fragment = d.createDocumentFragment();
			for (var i = this.images.length - 1; i >= 0; i--) {
				var img = new Image();
				img.src = this.images[i];
				img.className = 'Flickfeed-image';
				fragment.appendChild(img);
			}
			this.element.appendChild(fragment);
			finished();
		}
	};

	Flickfeed.prototype.compileTemplate = function() {
		var html = '';
		for (var i = this.images.length - 1; i >= 0; i--) {
			html += this.template.replace(/{{image}}/g, this.images[i]);
		}
		return html;
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
		var url = this.ApiConfig.root + "?method=" + this.ApiConfig.method + "&api_key=" + this.ApiConfig.ApiKey + ((this.settings.userId) ? "&user_id=" + this.settings.userId : "&group_id=" + this.settings.groupId) + "&format=" + this.ApiConfig.format + '&sort=' + this.settings.sort + '&per_page=' + this.settings.limit + '&' + this.ApiConfig.extras.join('&');
		return url;
	};

	Flickfeed.prototype.buildImageUrl = function(image) {
		var url = "http://farm" + image.farm + ".staticflickr.com/" + image.server + "/" + image.id + "_" + image.secret + "_" + this.settings.size + ".jpg";
		return url;
	};

	w.Flickfeed = Flickfeed;

})(window, document);