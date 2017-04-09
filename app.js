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
	const main = document.querySelector('.app-news');
	return main.appendChild(articleNode)
}

function getNewSiteThumbnail(){
	const siteThumbnail = document.querySelector('#site-tumbnail-template .news-source');
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
	//set source_id
	newThumbnail.dataset.source_id = newsSiteData.id;
	//set source_url
	newThumbnail.dataset.source_url = newsSiteData.url;
	//set source_url
	newThumbnail.dataset.source_name = newsSiteData.name;

	return newThumbnail;
}

function addNewsSiteThumbnail(siteThumbnail){
	const container = document.querySelector('.app-content>.news-sources-container>.articles');
	return container.appendChild(siteThumbnail)
}

function returnToThumbnails(){
	document.querySelectorAll('.app-body .news-card').forEach(article=>article.style.display="none");
}

/**
 * get news
 */
function getNews(source){
	APICallParams.source = source || 'national-geographic';
	/**
	 * Make API call for news sites
	 */
	fetch(articlesURL + '?' + makeGETValues(APICallParams))
	.then(function(response) {
		// Convert to JSON
		return response.json();
	})
	.then((resp)=>{
		document.querySelector('.loader').classList.add('hidden');
		console.log(resp);
		resp.articles.forEach( data => addArticle(makeArticleNode(data)) );		
		return resp;
	})
	.then(console.log)
	.catch(function(error){
		console.log(error);
		document.querySelector('#view-trigger').checked = false;
		returnToThumbnails();
	});
}

function thumbnailClickHandler(e){
	const 	newsSourceId = e.target.parentElement.dataset.source_id,
			navLinkText = e.target.parentElement.dataset.source_name || 'back';

	document.querySelector('label[for="view-trigger"]').innerText = navLinkText;
	console.log(newsSourceId);
	getNews(newsSourceId);
}

function app(){
	/**
	 * Make API call for news sites
	 */
	fetch(sourcesURL)
	.then(function(response) {
		// Convert to JSON
		return response.json();
	})
	.then((resp)=>{
		document.querySelector('.loader').classList.add('hidden')
		resp.sources.forEach( data => addNewsSiteThumbnail(makeSiteThumbnail(data)) );
		document.querySelectorAll('.news-source').forEach(thumbnail=>thumbnail.addEventListener('click',thumbnailClickHandler));
		return resp;
	})
	.then(console.log)
	.catch(console.error);

	document.querySelector('label[for="view-trigger"]').addEventListener('click',returnToThumbnails);

}

window.onload = app;