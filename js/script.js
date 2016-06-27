
//console.log(baseURLSingleListing)

//$.getJSON(baseURLSingleListing).then(function(d){

//	console.log(d)
//})


//console.log($)
//console.log(_)
//console.log(Backbone)

//Define Key Elements
var listingsNode = document.querySelector("#listings-container")
var apiKey = '9l87ijwnzalacowcpoicgfsb'
var urlMultiListings = "https://openapi.etsy.com/v2/listings/active.js?includes=Images,Shop&callback=?&api_key=" + apiKey
var urlSingleListing = "https://openapi.etsy.com/v2/listings/191387913.js?includes=Images,Shop&callback=?&api_key=" + apiKey


//Test Listings Node
listingsNode.innerHTML = "<p>Esty Listings Coming Soon...</p>"


//Create Backbone View
var EstyMultiView = Backbone.View.extend({
	el: '#listings-container',

	_buildHTMLTemplate: function(modelsArr){
		var htmlString = ''
		for(var i = 0; i < modelsArr.length; i++){
			var r = modelsArr[i]
			console.log(r)
			htmlString += '<div id="singleItem">'
				htmlString += '<img src="' + r.get('Images')[0].url_170x135 + '">'
				htmlString += '<p>' + r.get('title') + '</p>'
				//htmlString += '<p>' + r.get('Shop[Shop_name]') + '</p>'
			htmlString += '</div>'
		}
		return htmlString
	},

	_renderHTML: function(){
		this.el.innerHTML = this._buildHTMLTemplate(this.coll.models)
	},

	initialize: function(Collection){
		console.log(Collection)
		this.coll = Collection
	}
})


//Create Backbone Model
var EstyModel = Backbone.Model.extend({

})


//Create Backbone Collection
var EstyCollection = Backbone.Collection.extend({
	model: EstyModel,
	url:'https://openapi.etsy.com/v2/listings/active.js?includes=Images,Shop&callback=?&api_key=9l87ijwnzalacowcpoicgfsb',
	parse: function(apiResData){
		console.log('Here comes API Res Data', apiResData)
		return apiResData.results
	}

	// initialize function used to add extra parameters to url
	//initialize: function(){

	//}
})


//Create Backbone Router

var AppRouter = Backbone.Router.extend({
	routes: {
		'*home': 'showMultiView',
		'details/:id': 'showSingleView',
		'search/:query': 'showCategoryView'
		
	},


	showMultiView: function(){
		var self = this

		var estyColl = new EstyCollection()

		estyColl.fetch().then(function(apiResData){
			console.log('this is the collection', apiResData.results)
			self.activelistings = new EstyMultiView(estyColl)
			self.activelistings._renderHTML()
	
		})
	},


	showSingleView: function(){
		console.log('This is showSingleView')
	},


	showCategoryView: function(){
		console.log('This is showCategoryView')
	},


	initialize: function(){
		Backbone.history.start()
	}
})

var estyRouter = new AppRouter()