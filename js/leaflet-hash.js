(function(window) {
    var HAS_HASHCHANGE = (function() {
        var doc_mode = window.documentMode;
        return ('onhashchange' in window) &&
            (doc_mode === undefined || doc_mode > 7);
    })();
    
    L.Hash = function(map) {
        this.onHashChange = L.Util.bind(this.onHashChange, this);
    
        if (map) {
            this.init(map);
        }
    };
    
    L.Hash.prototype = {
        map: null,
        lastHash: null,
    
        parseHash: function(hash) {
            if(hash.indexOf('#') == 0) {
                hash = hash.substr(1);
            }
            var args = hash.split("/");
            if (args.length == 4) {
                var zoom = parseInt(args[0], 10),
                    lat = parseFloat(args[1]),
                    lon = parseFloat(args[2]);
					mapType = args[3];
                if (isNaN(zoom) || isNaN(lat) || isNaN(lon) || typeof mapType==="undefined" ) {
                    return false;
                } else {
                    return {
                        center: new L.LatLng(lat, lon),
                        zoom: zoom,
						mapType: mapType
                    };
                }
            } else {
                return false;
            }
        },
    
        formatHash: function(map) {
            var center = map.getCenter(),
                zoom = map.getZoom(),
                precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2));
				
			if(map.hasLayer(skikart))
				mapType = "skikart";
			else
				mapType = "turkart";
            
            return "#" + [zoom,
                center.lat.toFixed(precision),
                center.lng.toFixed(precision),
				mapType
            ].join("/");
        },
    
        init: function(map) {
            this.map = map;
            
            this.map.on("moveend", this.onMapMove, this);
            
            // reset the hash
            this.lastHash = null;
            this.onHashChange();
    
            if (!this.isListening) {
                this.startListening();
            }
        },
    
        remove: function() {
            this.map = null;
            if (this.isListening) {
                this.stopListening();
            }
        },
        
        onMapMove: function(map) {
            // bail if we're moving the map (updating from a hash),
            // or if the map has no zoom set
            //console.log("oppdaterer");
            
            if (this.movingMap || this.map.getZoom() === 0) {
                return false;
            }
            
            var hash = this.formatHash(this.map);
            if (this.lastHash != hash) {
                location.replace(hash);
                this.lastHash = hash;
				
				
				// Oppdaterer embedkode
                
				var embedString = '<iframe width="'+frameWidth+'" height="'+frameHeight+'" frameborder="0" scrolling="no" marginheight="0"	marginwidth="0" src="http://www.turkompisen.no/embed.html?' +hash+ '"></iframe><br /><small><a href="http://www.turkompisen.no/?' +hash+ '" style="color:#0000FF;text-align:left">Se st&oslash;rre kart</a></small>'
				$('#embedText').val(embedString);
            }
        },
        
        updateEmbedCode: function() {
            // bail if we're moving the map (updating from a hash),
            // or if the map has no zoom set
            //console.log("oppdaterer");
            
            
            var hash = this.formatHash(this.map);
            if (this.lastHash != hash) {
                location.replace(hash);
                this.lastHash = hash;
				
				
				// Oppdaterer embedkode
                //console.log(frameWidth);
                
				
            }
			var embedString = '<iframe width="'+frameWidth+'" height="'+frameHeight+'" frameborder="0" scrolling="no" marginheight="0"	marginwidth="0" src="http://www.turkompisen.no/embed.html?' +hash+ '"></iframe><br /><small><a href="http://www.turkompisen.no/?' +hash+ '" style="color:#0000FF;text-align:left">Se st&oslash;rre kart</a></small>'
			$('#embedText').val(embedString);
        },
    
        movingMap: false,
        update: function() {
            var hash = location.hash;
            if (hash === this.lastHash) {
                // console.info("(no change)");
                return;
            }
            var parsed = this.parseHash(hash);
            if (parsed) {
                // console.log("parsed:", parsed.zoom, parsed.center.toString());
                this.movingMap = true;
                
                this.map.setView(parsed.center, parsed.zoom);
				
				// Her settes kun knappene til riktig CSS. Layer fikses når map objektet settes opp
				if(parsed.mapType == "skikart") {
					//console.log("Viser skikart");
					//console.log(map.hasLayer(turkart));
					//this.map.addLayer(skikart);
					//setTimeout("this.map.removeLayer(turkart)", 500);
					
					$('#button-turkart').removeClass("btn-info disabled");
					$('#button-skikart').addClass("btn-info disabled");
					
				}
				else {
					//console.log("Viser turkart");
					//this.map.addLayer(turkart);
					//setTimeout("this.map.removeLayer(skikart)", 500);
					$('#button-skikart').removeClass("btn-info disabled");
					$('#button-turkart').addClass("btn-info disabled");
                }
                this.movingMap = false;
            } else {
                // console.warn("parse error; resetting:", this.map.getCenter(), this.map.getZoom());
                this.onMapMove(this.map);
            }
        },
    
        // defer hash change updates every 100ms
        changeDefer: 100,
        changeTimeout: null,
        onHashChange: function() {
            // throttle calls to update() so that they only happen every
            // `changeDefer` ms
            if (!this.changeTimeout) {
                var that = this;
                this.changeTimeout = setTimeout(function() {
                    that.update();
                    that.changeTimeout = null;
                }, this.changeDefer);
            }
        },
    
        isListening: false,
        hashChangeInterval: null,
        startListening: function() {
            if (HAS_HASHCHANGE) {
                L.DomEvent.addListener(window, "hashchange", this.onHashChange);
            } else {
                clearInterval(this.hashChangeInterval);
                this.hashChangeInterval = setInterval(this.onHashChange, 50);
            }
            this.isListening = true;
        },
    
        stopListening: function() {
            if (HAS_HASHCHANGE) {
                L.DomEvent.removeListener(window, "hashchange", this.onHashChange);
            } else {
                clearInterval(this.hashChangeInterval);
            }
            this.isListening = false;
        }
    };
})(window);