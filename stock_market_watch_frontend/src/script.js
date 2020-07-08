document.addEventListener("DOMContentLoaded", function(e){
 const stocksUrl = "http://localhost:3000/api/v1/stocks"
 const stockCollection = document.querySelector("#stock-collection")
 const searchImg = document.createElement('img')

document.addEventListener("click", function(e){
    e.preventDefault()
    if(e.target.textContent === "On The Move"){
      stockCollection.innerHTML = ""
      getStocks()

    } else if (e.target.textContent === "Sign up"){
      console.log("SignUp")
    } else if (e.target.textContent === "Log in"){

    } else if (e.target.value === "go"){
       e.preventDefault()
       const searchInput = document.getElementById("search-input")
       getStock(searchInput.value)
    }
  })

function getStock(stockSymbol){
  const stockUrl = `https://cloud.iexapis.com/stable/stock/${stockSymbol}/batch?types=quote,news&range=1m&last=10&token=pk_f57a13c9af324593872971b36ca28c8c`
  fetch(stockUrl)
  .then(response => response.json())
  .then(data => {
    renderSearch(data)
 })
}

function renderSearch(stock){
  let stockDiv = document.createElement('div')
  let stockNewsUl = document.createElement('ul')
      setStockImage(stock.quote.symbol)
  // searchImg.setAttribute("class", "company_logo")

     console.log(searchImg)

    stockDiv.innerHTML = `
    <h1>${stock.quote.companyName}</h1><br>
    <b>avg total volume:</b> ${stock.quote.avgTotalVolume}<br>
    <b>change percent:</b> ${stock.quote.changePercent}<br>
    <b>latest price:</b> ${stock.quote.latestPrice}<br>
    <b>latest update:</b> ${stock.quote.latestTime}<br>
    <b>market cap:</b> ${stock.quote.marketCap}<br>
    <b>pe ratio:</b> ${stock.quote.peRatio}<br>
    <b>primary exchange:</b> ${stock.quote.primaryExchange}<br>
    <b>symbol:</b> ${stock.quote.symbol}<br>
    <b>week52High:</b> ${stock.quote.week52High}<br>
    <b>week52Low:</b> ${stock.quote.week52Low}<br>
    <b>ytd change:</b> ${stock.quote.ytdChange}<br>
    <b>news:</b><br>
    `
    stockDiv.prepend(searchImg)
    stockCollection.innerHTML = "<ul></ul>"
    stockCollection.append(stockDiv)

}

function setStockImage(stockSymbol){
  fetch(`http://localhost:3000/api/v1/stocks/${stockSymbol}`)
   .then(response => response.json())
   .then(data => {
     searchImg.setAttribute("src", `${data.url}`)
   })
}
function getStocks(){
   fetch(stocksUrl)
  .then(response => response.json())
  .then(data => {
  renderStocks(data)
 })
}

function renderStocks(stocks){
  stocks.forEach(stock =>{
  renderStock(stock)
 })
}

function renderStock(stock){
  let stockDiv = document.createElement('div')
  let stockImg = document.createElement('img')
  let stockNewsUl = document.createElement('ul')

  stockImg.src = stock.logo_url
  stockImg.setAttribute("class", "company_logo")
  stockDiv.innerHTML = `
  <h1>${stock.company_name}</h1><br>
  <b>avg total volume:</b> ${stock.avg_total_volume}<br>
  <b>change percent:</b> ${stock.change_percent}<br>
  <b>latest price:</b> ${stock.latest_price}<br>
  <b>latest update:</b> ${stock.latest_update}<br>
  <b>market cap:</b> ${stock.market_cap}<br>
  <b>pe ratio:</b> ${stock.pe_ratio}<br>
  <b>primary exchange:</b> ${stock.primary_exchange}<br>
  <b>symbol:</b> ${stock.symbol}<br>
  <b>ytd change:</b> ${stock.ytd_change}<br>
  <b>news:</b><br>
  `
  stockDiv.prepend(stockImg)

  newsArray = stock.news.split("#<IEX::Resources::News ")
  newsArray.shift()
  // console.log(newsArray)

  newsArray.forEach(i => {

  i.slice(1, -3)

  let keyVal = i.split("=");
  console.log(keyVal)
  obj = { }
  obj["date"] = keyVal[1].slice(0, -9)
  obj["headline"] = keyVal[2].slice(1, -1)
  obj["body"] = keyVal[5].slice(1, -5)
  obj["src"] = keyVal[6].slice(1, -8)


  li = document.createElement('li')
  li.innerHTML =
  `<h3>${obj.headline}</h3><br>
  <p>${obj.body}<br>source: ${obj.src}</p><br>
  `
  stockNewsUl.append(li)

})

stockDiv.append(stockNewsUl)
stockCollection.append(stockDiv)


}



})
