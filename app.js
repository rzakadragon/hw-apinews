const   myAPIkey = '1e5e66dd13c143a5a31eed8c0dff8eff';

const   articlesURL = 'https://newsapi.org/v1/articles',
        sourcesURL = 'https://newsapi.org/v1/sources';

const   APICallParams = {
            source: 'national-geographic',
            apiKey: myAPIkey,
            sortBy: 'top'                   /*  top/latest/popular   */
        };

/**
 * Helper function to make GET querry variables from params object
 */
function makeGETValues(params){
    const esc = encodeURIComponent;
    return query = Object.keys(params)
                    .map(k => esc(k) + '=' + esc(params[k]))
                    .join('&');
}

function getNewArticleNode(){
	const articleTemplate = document.getElementById('article-template').getElementsByTagName('article')[0];
	return articleTemplate.cloneNode(true)
}

function makeArticleNode(articleData){
	const newArticle = getNewArticleNode();

	// set title
	newArticle.querySelector('header h2').innerText = articleData.title;
	// set image
	newArticle.querySelector('header').style.backgroundImage = 'url("' + articleData.urlToImage + '")';
	// set description
	newArticle.querySelector('.description p').innerText = articleData.description;
	//set author
	newArticle.querySelector('.author').innerText = articleData.author;
	//set date
	const time = new Date(articleData.publishedAt);
	const timeStr = time.toDateString()							// -> "Sat Apr 08 2017"
						.split(' ')								// -> ["Sat", "Apr", "08", "2017"]
						.filter((elem,i)=>i===1 || i === 2)		// -> ["Apr", "08"]
						.join(' ');								// -> "Apr 08"
	newArticle.querySelector('time').innerText = timeStr;
	newArticle.querySelector('time').attributes.datetime = time;
	//set link
	newArticle.querySelector('footer a').href = articleData.url;

	return newArticle;
}

function addArticle(articleNode){
	const main = document.querySelector('.app-content');
	return main.appendChild(articleNode)
}

function getNewSiteThumbnail(){
	const siteThumbnail = document.getElementById('site-tumbnail-template').getElementsByTagName('article')[0];
	return siteThumbnail.cloneNode(true)
}

function makeSiteThumbnail(newsSiteData){
	const newThumbnail = getNewSiteThumbnail();

	//set image
	newThumbnail.querySelector('.thumbnail-image').style.backgroundImage = 'url("' + newsSiteData.urlsToLogos.large + '")';
	//set title
	newThumbnail.querySelector('.title').innerText = newsSiteData.name;
	//set description
	newThumbnail.querySelector('.description').innerText = newsSiteData.description;
	//mark description if it's too long
	if (newsSiteData.description.length > 200) newThumbnail.querySelector('.description').classList.add('long-text');
	//set category class
	newThumbnail.classList.add(newsSiteData.category);

	return newThumbnail;
}

function addNewsSiteThumbnail(siteThumbnail){
	const container = document.querySelector('.app-content>.news-sources-container>.articles');
	return container.appendChild(siteThumbnail)
}

var debug = null;

function app(){
	/**
	 * Make API call for news sites
	 */
	fetch('https://newsapi.org/v1/sources')
	.then(function(response) {
			// Convert to JSON
			return response.json();
	})
	.then((resp)=>{
		resp.sources.forEach( data => addNewsSiteThumbnail(makeSiteThumbnail(data)) );
		debug = resp; 
		return resp;})
	.then(console.log)
	.catch(console.error);


	/**
	 * Make API call
	 */
	/*fetch(articlesURL + '?' + makeGETValues(APICallParams))
	.then(function(response) { 
			// Convert to JSON
			return response.json();
	})
	.then((resp)=>{
		resp.articles.forEach( data => addArticle(makeArticleNode(data)) ); 
		debug = resp; 
		return resp;})
	.then(console.log)
	.catch(console.error);*/

	

}

window.onload = app;