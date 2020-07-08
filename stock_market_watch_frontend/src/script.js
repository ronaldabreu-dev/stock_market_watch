document.addEventListener("DOMContentLoaded", function(e){

  document.addEventListener("click", function(e){
    e.preventDefault()
    if(e.target.textContent === "On The Move"){
      stockCollection.innerHTML = ""
      getStocks()
    } else if (e.target.textContent === "Sign up"){
      console.log("SignUp")
    } else if (e.target.textContent === "Log in"){

    } else if (e.target.value === "go"){
      
    } else if (e.target.className === "show-info"){
      console.log(e.target.parentNode.dataset.news[0])
      const stockDiv = e.target.parentNode
      const stockData = e.target.parentNode.dataset
      const moreInfo = document.createElement('div')
      const stockNewsUl = document.createElement('ul')
      moreInfo.className = "more-info"

      newsArray = stockData.news.split("#<IEX::Resources::News ")
        newsArray.shift()
        // console.log(newsArray)

        newsArray.forEach(i => {

          i.slice(1, -3)

          let keyVal = i.split("=");
            // console.log(keyVal[3])
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
      moreInfo.innerHTML = `
        <p>Total volume: ${stockData.avg_total_volume}</p>
        <p>Change percent: ${stockData.change_percent}</p>
        <p>Latest price: ${stockData.latest_price}</p>
        <p>Latest update: ${stockData.latest_update}</p>
        <p>Market cap: ${stockData.market_cap}</p>
        <p>P/E ratio: ${stockData.pe_ratio}</p>
        <p>Primary exchange: ${stockData.primary_exchange}</p>
        <p>Symbol: ${stockData.symbol}</p>
        <p>YTD change: ${stockData.ytd_change}</p>
        <p>News: </p>
      `
      moreInfo.append(stockNewsUl)
      stockDiv.append(moreInfo)
      // stockDiv.append(stockNewsUl)
      e.target.className = "hide-info"
      e.target.textContent = "Hide Info"
    } else if (e.target.className === "hide-info"){
      const moreInfo = document.querySelector(".more-info")
      moreInfo.remove()
      e.target.className = "show-info"
      e.target.textContent = "Show Info"
    }
  })

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
      
      // stockNewsUl.className = "stock-news"

    stockImg.src = stock.logo_url
    stockImg.setAttribute("class", "company_logo")
    stockDiv.innerHTML = `
    <h1>${stock.company_name}</h1><br>
    <button class="show-info">Show Info</button>
    `
    stockDiv.className = "each-stock"
    stockDiv.dataset.avg_total_volume = `${stock.avg_total_volume}`
    stockDiv.dataset.change_percent = `${stock.change_percent}`
    stockDiv.dataset.latest_price = `${stock.latest_price}`
    stockDiv.dataset.latest_update = `${stock.latest_update}`
    stockDiv.dataset.market_cap = `${stock.market_cap}`
    stockDiv.dataset.pe_ratio = `${stock.pe_ratio}`
    stockDiv.dataset.primary_exchange = `${stock.primary_exchange}`
    stockDiv.dataset.symbol = `${stock.symbol}`
    stockDiv.dataset.ytd_change = `${stock.ytd_change}`
    stockDiv.dataset.news = `${stock.news}`

      stockDiv.prepend(stockImg)



        // stockDiv.append(stockNewsUl)
        stockCollection.append(stockDiv)


    }



})
