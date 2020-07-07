document.addEventListener("DOMContentLoaded", function(e){

    stocksUrl = "http://localhost:3000/api/v1/stocks"

    const stockCollection = document.querySelector("#stock-collection")

    fetch(stocksUrl)
    .then(response => response.json())
    .then(data => {
        const toJson = data[0].news[0].to_json
        
        console.log(toJson)
       
        renderStocks(data)
    })

    function renderStocks(stocks){
        stocks.forEach(stock =>{
            renderStock(stock)
        })
    }

    function renderStock(stock){
        const stockDiv = document.createElement('div')
        const stockImg = document.createElement('img')
        stockImg.src = stock.logo_url
        stockDiv.innerHTML = `
        <h2>${stock.company_name}</h2>
        <h4>${stock.symbol}</h4>
        <p>${stock.news.first}</p>
        `
        stockDiv.append(stockImg)
        stockCollection.append(stockDiv)
    
    }

})