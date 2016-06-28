//console.log($)
//console.log(_)
//console.log(Backbone)


//Define Key Elements
var listingsNode = document.querySelector("#listings-container")
var inputNode = document.querySelector("#searchBox")
var apiKey = '9l87ijwnzalacowcpoicgfsb'


//Test Listings Node
listingsNode.innerHTML = "<p>Esty Listings Coming Soon...</p>"




//Create Backbone Views
	//SearchView
var EstySearchView = Backbone.View.extend({
	el: '#header',

	events: {
		"keydown #searchBox" : "_handleSearch"

	},

	_handleSearch: function(evtObj){
		if(evtObj.keyCode === 13){
			var userInput = evtObj.target.value
			//console.log(evtObj.target.value)
			location.hash = "search/" + userInput
			evtObj.target.value = ''
		}
	}

	/*_buildHTMLTemplate: function(){
		var htmlString = ''
		//no-op
		return htmlString
	},

	_renderHTML: function(){
		// no-op
		// this.el.innerHTML += this._buildHTMLTemplate()
	},

	initialize: function(collection){
		// no-op
	} */
})

	//Multiview
var EstyMultiView = Backbone.View.extend({
	el: '#listings-container',

	events: {
		"click .listingCard" : "_showItemDetails",
		
	},

	_showItemDetails: function(evtObj){
	//	console.log(evtObj)
		var clickedListing = evtObj.currentTarget.getAttribute('data-id')
		window.location.hash = "details/" + clickedListing
	},

	_buildHTMLTemplate: function(modelsArr){
		var htmlString = ''
		for(var i = 0; i < modelsArr.length; i++){
			var r = modelsArr[i]
			//console.log('this is multi collection', r)
			htmlString += '<div class="listingCard" data-id='+ r.get('listing_id')+'>'
			htmlString += 		'<img src="' + r.get('Images')[0].url_170x135 + '">'
			htmlString += 		'<p>' + r.get('title') + '</p>'
			htmlString += 		'<p>' + r.get('Shop[Shop_name]') + '</p>'
			htmlString += 		'<p>' + '$'+ r.get('price') + '</p>'
			htmlString += '</div>'
		}
		return htmlString
	},

	_renderHTML: function(){
		this.el.innerHTML = this._buildHTMLTemplate(this.coll.models)
	},

	initialize: function(Collection){
		//console.log(Collection)
		this.coll = Collection
	}
})

	//Singleview
var EstySingleView = Backbone.View.extend({
	el: '#listings-container',

	_buildHTMLTemplate: function(theCollection){
		var listModels = theCollection.models,
	        currentItem  = 0
		//  console.log(listModels[currentItem])

		var htmlString  = '<div class="singlelisting" data-id='+ listModels[currentItem].get('listing_id')+'>'
			htmlString += 		'<img src="' + listModels[currentItem].get('Images')[0].url_170x135 + '">'
			htmlString += 		'<p>' + listModels[currentItem].get('title') + '</p>'
			htmlString += 		'<p>' + listModels[currentItem].get('Shop[Shop_name]') + '</p>'
			htmlString += 		'<p>' + '$'+ listModels[currentItem].get('price') + '</p>'
			htmlString += '</div>'
		
		return htmlString
	},

	_renderHTML: function(){
		this.el.innerHTML = this._buildHTMLTemplate(this.coll)
	},

	initialize: function(theCollection){
	//	console.log(Collection)
		this.coll = theCollection
	}
})




//Create Backbone Models
	//Multi Model
var EstyMultiModel = Backbone.Model.extend({

})

	//Single Model
var EstySingleModel = Backbone.Model.extend({

})




//Create Backbone Collections
	//Multiview Collection
var EstyMultiCollection = Backbone.Collection.extend({
	model: EstyMultiModel,
	url:'https://openapi.etsy.com/v2/listings/active.js',
	parse: function(apiResData){
		//console.log('Here comes API Res Data', apiResData)
		//	console.log('this is the single collection', apiResData.results)
		return apiResData.results
	},
}) 

	//Singleview Collection
var EstySingleCollection = Backbone.Collection.extend({
  	model: EstySingleModel,
  	url: function () {
  		return 'https://openapi.etsy.com/v2/listings/' + this.id + '.js'
  	},

  	parse: function(apiResData){
  		//console.log(apiResData)
  		return apiResData.results
  	},

  	initialize: function(listingId){
  		// console.log(listingId)
    this.id = listingId
  	} 
}) 




//Create Backbone Router
var AppRouter = Backbone.Router.extend({
	routes: {
		'details/:id': 'showSingleView',
		'search/:query': 'showSearchView',
		'*home': 'showMultiView'
	},

	showMultiView: function(){
		//console.log('This is showMultiView')
		var self = this
		
		var estyColl = new EstyMultiCollection()

		estyColl.fetch({
			dataType: 'jsonp',
			data: {
				//includes=Images,Shop&callback=?&api_key=9l87ijwnzalacowcpoicgfsb
				includes: "Images,Shop",
				api_key: "9l87ijwnzalacowcpoicgfsb"
			}
		}).then(function(apiResData){
			
			self.activelistings = new EstyMultiView(estyColl)
			self.activelistings._renderHTML()	
		})
	},

	showSingleView: function(id){
		//console.log('This is showSingleView')
		var self = this
		
		var singleEstyColl = new EstySingleCollection(id)
		
		singleEstyColl.fetch({
			dataType: 'jsonp',
			data: {
				//includes=Images,Shop&callback=?&api_key=9l87ijwnzalacowcpoicgfsb
				includes: "Images,Shop",
				api_key: "9l87ijwnzalacowcpoicgfsb",
				
			}
		}).then(function(apiResData){
			
			//console.log('this is the single collection', apiResData.results[0])
			self.singlelistings = new EstySingleView(singleEstyColl)
			self.singlelistings._renderHTML()
		})
	},

	showSearchView: function(query){
		//console.log('This is showSearchView')
		var self = this

		var estySearchColl = new EstyMultiCollection()

		estySearchColl.fetch({
			dataType: 'jsonp',
			data: {
				//includes=Images,Shop&callback=?&api_key=9l87ijwnzalacowcpoicgfsb
				includes: "Images,Shop",
				api_key: "9l87ijwnzalacowcpoicgfsb",
				keywords: query
			}
		}).then(function(apiResData){
			
			self.searchlistings = new EstyMultiView(estySearchColl)
			self.searchlistings._renderHTML()
	
		})

	},


	initialize: function(){
		var searchViewHeader = new EstySearchView()
		Backbone.history.start()
	}
})

var estyRouter = new AppRouter()