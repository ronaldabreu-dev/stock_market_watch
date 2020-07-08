document.addEventListener("DOMContentLoaded", function(e){
    const stocksUrl = "http://localhost:3000/api/v1/stocks"
    const stockCollection = document.querySelector("#stock-collection")

  function getStocks(){fetch(stocksUrl)
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
      const stockDiv = document.createElement('div')
      const stockImg = document.createElement('img')
      const stockNewsUl = document.createElement('ul')

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

getStocks()

})
