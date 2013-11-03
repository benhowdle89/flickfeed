(function(w, d) {
	function Flickfeed(options) {
		if (this === w) {
			return new arguments.callee(options);
		}
		var x = new XMLHttpRequest();
		x.open("get", "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d0e0afac02f8941c751f0850de7bc020&user_id=59597329%40N08&format=json&nojsoncallback=1", true);
		x.onreadystatechange = function() {
			if (x.readyState == 4) {
				console.log(x.responseText);
			}
		};
		x.send();
	}

	w.Flickfeed = Flickfeed;

})(window, document);