document.addEventListener("DOMContentLoaded", function(e){
  const stocksUrl = "http://localhost:3000/api/v1/stocks"
  const stockCollection = document.querySelector("#stock-collection")
  const navBarUl = document.querySelector('.navBarUl')
  const searchInput = document.getElementById("search-input")

  let userName = ""
  let userPassword = ""

  document.addEventListener("click", function(e){
    e.preventDefault()

    if (e.target.id === "onTheMoveNav"){
      stockCollection.innerHTML = ""
      stockCollection.setAttribute("id", "onTheMove")
      getStocks()

    } else if (e.target.textContent === "Sign up"){

      renderForm("signUp")

    } else if (e.target.textContent === "Log in"){

       renderForm("logIn")

    } else if (e.target.id === "searchButton"){

      e.preventDefault()
       getStock(searchInput.value)

    } else if (e.target.className === "show-info"){
      const stockDiv = e.target.parentNode
      const stockData = e.target.parentNode.dataset
      // console.log(stockData)
      const moreInfo = document.createElement('div')

      moreInfo.className = "more-info"
        e.target.textContent = "Hide Market Data"

      moreInfo.innerHTML = `
        <p>Latest price: ${stockData.latest_price}</p>
        <p>Total volume: ${stockData.avg_total_volume}</p>
        <p>Change percent: ${stockData.change_percent}</p>
        <p>Latest update: ${stockData.latest_update}</p>
        <p>Market cap: ${stockData.market_cap}</p>
        <p>P/E ratio: ${stockData.pe_ratio}</p>
        <p>Primary exchange: ${stockData.primary_exchange}</p>
        <p>Symbol: ${stockData.symbol}</p>
        <p>YTD change: ${stockData.ytd_change}</p>
      `

      stockDiv.append(moreInfo)

      e.target.className = "hide-info"
      e.target.textContent = "Hide Maket Data"
      if (stockCollection.id !== "myStocks"){
        button = document.createElement("button")
        button.setAttribute("type", "submit")
        button.setAttribute("id", "trackButton")
        button.textContent = "Start Tracking"
        moreInfo.append(button)
      }

    } else if (e.target.className === "hide-info"){

      const moreInfo = document.querySelector(".more-info")
      moreInfo.remove()
      e.target.className = "show-info"
      e.target.textContent = "View Market Data"

    } else if (e.target.id === "signUp") {
      userName = e.target.parentNode.childNodes[3][0].value
      userPassword = e.target.parentNode.childNodes[3][1].value
           signUp(userName, userPassword)

    } else if (e.target.id === "myStocks") {

       let stockObj = {}
       let x = []
      stockObj[`"user_name"`] = userName
      fetch(`http://localhost:3000/api/v1/user_stocks/${userName}`,{
      headers: {
      'Content-Type' : 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
            stockCollection.innerHTML = ""
            data.forEach(i => {
              getUserStock(i["symbol"])
              x.push(i)
            });

       })
      .catch((error) => {
       console.error('Error:', error);
      })
      // console.log(x)

    } else if (e.target.id === "logOut") {

      logOut(userName)

    } else if (e.target.id === "logIn") {
      e.preventDefault()
            userName = e.target.parentNode.childNodes[3][0].value
            userPassword = e.target.parentNode.childNodes[3][1].value
      setSession(userName, userPassword)

    } else if (e.target.id === "trackButton") {
                e.target.disabled = true
                tracker(e)
    }  
  })

function renderNews(newsArray){
  const stockNewsUl = document.createElement('ul')
  stockNewsUl.setAttribute("class", "newsUl")
  newsArray.forEach(i => {
    newsDiv = document.createElement("div");
    newsImg = document.createElement("img");
    newsImg.src = i.image
    newsImg.setAttribute("class", "news-img")
    newsDiv.setAttribute("class", "news-div")
    newsDiv.innerHTML = `
    <li class="newsLi">
      <a href="${i.url}">${i.headline}</a>
      <br>
      <p>${i.summary}</p>
    </li>`

   stockNewsUl.append(newsImg)
   stockNewsUl.append(newsDiv)
  });
  return stockNewsUl;
}

function logOut(userName){
  fetch("http://localhost:3000/api/v1/sessions",{
  method: "DELETE",
  headers: {
  'Content-Type' : 'application/json'
    },
  body: JSON.stringify({
    "name": userName,
    "password": userPassword
  })
})
 .then(response => response.json())
 .then(data => {
     if(data[0] === "wrong password or username"){
       renderForm("signIn")
       form = document.querySelector(".form")
       form.innerHTML += `<br><h3style="text-align:center">${data[0]}<h3>`
     } else {
        location.reload();
     }
   })
 .catch((error) => {
   console.error('Error:', error);
 })
}

function searchtracker(e){
        let stockObj = {}
         let x = []
         symbol = e.target.parentNode.childNodes[34].textContent
        stockObj[`"symbol"`] = symbol
        stockObj[`"user_name"`] = userName
        
        fetch("http://localhost:3000/api/v1/user_stocks", {
        method: "POST",
        headers: {
        'Content-Type' : 'application/json'
          },
        body: JSON.stringify({
             stockObj
        })
      })
       .then(response => response.json())
       .then(data => {
              console.log('Success:', data);
              if (data.message) {
               x.push(data.message)
             } else {
              data.forEach(i => {
                getStock(i["symbol"])
              });
            }
            stockCollection.childNodes[0].prepend(x[0])
         })
       .catch((error) => {
         console.error('Error:', error);
       })
   }

function tracker(e){
        const stockDataArray = e.target.parentNode.childNodes[15].innerText.split(": ");

         let stockObj = {}
         let x = []
        stockObj[`"symbol"`] = stockDataArray[1]
        stockObj[`"user_name"`] = userName

        fetch("http://localhost:3000/api/v1/user_stocks",{
        method: "POST",
        headers: {
        'Content-Type' : 'application/json'
          },
        body: JSON.stringify({
             stockObj
        })
      })
       .then(response => response.json())
       .then(data => {
              console.log('Success TOP 10:', data);
              stockCollection.innerHTML = ""
              data.forEach(i => {
                getStock(i["symbol"])
                x.push(data)
              });
         stockCollection.innerHTML += x[0].message
         })
       .catch((error) => {
         console.error('Error:', error);
       })
   }

function signUp(userName, userPassword){
  fetch("http://localhost:3000/api/v1/users",{
  method: "POST",
  headers: {
  'Content-Type' : 'application/json'
    },
  body: JSON.stringify({
    "name": userName,
    "password": userPassword
  })
})
 .then(response => response.json())
 .then(data => {
   errors = []
     if(Array.isArray(data)){
       renderForm("signUp")
       form = document.querySelector(".form")
        data.forEach(e => {

          errors.push(" " + e)
        });
       form.innerHTML += errors
     } else {
       setSession(userName, userPassword)
     }
   })
 .catch((error) => {
   console.error('Error:', error);
 })
}

function setSession(userName, userPassword){
  fetch("http://localhost:3000/api/v1/sessions",{
  method: "POST",
  headers: {
  'Content-Type' : 'application/json'
    },
  body: JSON.stringify({
    "name": userName,
    "password": userPassword
  })
})
 .then(response => response.json())
 .then(data => {
     if(data[0] === "wrong password or username"){
       renderForm("signIn")
       form = document.querySelector(".form")
       form.innerHTML += `<br><h3style="text-align:center">${data[0]}<h3>`
     } else {

       renderUserPage(userName, data)
     }
   })
 .catch((error) => {
   console.error('Error:', error);
 })

}

function renderUserPage(userName, userStocks){
   stockCollection.innerHTML = `<h1 style="color:#f8cf26">Welcome ${userName}!<h1>`
   stockCollection.setAttribute("id", "myStocks")

   const myStocks = document.createElement("li")
   const logOut = document.createElement("li")

   const signUp = document.getElementById('signUp')
   const logIn = document.getElementById('logIn')
   const onTheMove = document.getElementById("onTheMoveNav")

   myStocks.setAttribute("id", "myStocks")
   myStocks.innerHTML = "My Stocks"

   logOut.setAttribute("id", "logOut")
   logOut.innerHTML = "Log Out"

   navBarUl.removeChild(signUp)
   navBarUl.removeChild(logIn)
   navBarUl.removeChild(onTheMove)

   navBarUl.prepend(logOut)
   navBarUl.prepend(onTheMove)
   navBarUl.prepend(myStocks)
    renderUserStocks(userStocks)

}

function renderForm(s){
      e.preventDefault()

      stockCollection.innerHTML = ""
      signUpdiv = document.createElement("div")
      button = document.createElement("button")
      button.setAttribute("type", "submit")
      button.setAttribute("id", `${s}`)
      button.textContent = "go"
      signUpdiv.setAttribute("class", "form")
      signUpdiv.innerHTML= `
       <h1>ENTER</h1>
       <form class="form" action="index.html" method="post">
          <label for="user-name-input">Username:</label>
         <input type="text" id="user-name-input" name="user-name-input">

         <label for="user-password-input">Password:</label>
        <input type="password" id="user-password-input" name="user-password-input">
       </form>
`
      signUpdiv.append(button)
      stockCollection.append(signUpdiv)
    }

function getStock(stockSymbol){
      const stockUrl = `https://cloud.iexapis.com/stable/stock/${stockSymbol}/batch?types=quote,news,logo&range=1m&last=10&token=pk_f57a13c9af324593872971b36ca28c8c`
      fetch(stockUrl)
      .then(response => response.json())
      .then(data => {
        renderSearch(data)
     })

}

function renderSearch(stock){
  stockCollection.innerHTML = ""

   let searchImg = document.createElement('img')
    let stockDiv = document.createElement('div')
    let userStocksUl = document.createElement('ul')

     searchImg.setAttribute("class", "company_logo")
     searchImg.src = stock.logo.url
      stockDiv.setAttribute("class", "each-stock")
      stockDiv.innerHTML = `
      <h1>${stock.quote.companyName}</h1><br>
      <b>Latest Price: </b>${stock.quote.latestPrice}<br>
      <b>Avg Total Volume: </b>${stock.quote.avgTotalVolume}<br>
      <b>Change Percent: </b>${stock.quote.changePercent}<br>
      <b>Latest Update: </b>${stock.quote.latestTime}<br>
      <b>Market Cap: </b>${stock.quote.marketCap}<br>
      <b>PE Ratio: </b>${stock.quote.peRatio}<br>
      <b>Primary Exchange: </b> ${stock.quote.primaryExchange}<br>
      <b>Symbol: </b>${stock.quote.symbol}<br>
      <b>Week 52 High: </b>${stock.quote.week52High}<br>
      <b>Week 52 Low: </b>${stock.quote.week52Low}<br>
      <b>YTD Change: </b>${stock.quote.ytdChange}<br>
      `
      stockDiv.prepend(searchImg)
      userStocksUl.append(stockDiv)
      stockCollection.append(userStocksUl)
      button = document.createElement("button")
      button.setAttribute("type", "submit")
      button.setAttribute("id", "searchtrackButton")
      button.textContent = "Start Tracking"
      button.addEventListener("click", function(e){
          searchtracker(e)
      });
      stockDiv.append(button)
  }

function getUserStock(stockSymbol){

         const stockUrl = `https://cloud.iexapis.com/stable/stock/${stockSymbol}/batch?types=quote,news,logo&range=1m&last=10&token=pk_f57a13c9af324593872971b36ca28c8c`
         fetch(stockUrl)
         .then(response => response.json())
         .then(data => {
        
           renderUserStocks(data)
        })
       }

function renderUserStocks(stock){
        let searchImg = document.createElement('img')
         let stockDiv = document.createElement('div')
         let userStocksUl = document.createElement('ul')
          
          searchImg.setAttribute("class", "company_logo")
          searchImg.src = stock.logo.url
          
           stockDiv.setAttribute("class", "each-stock")
           stockDiv.innerHTML = `
           <h1>${stock.quote.companyName}</h1><br>
           <b>Latest Price:</b> ${stock.quote.latestPrice}<br>
           <b>Avg Total Volume:</b> ${stock.quote.avgTotalVolume}<br>
           <b>Change Percent:</b> ${stock.quote.changePercent}<br>
           <b>Latest Update:</b> ${stock.quote.latestTime}<br>
           <b>Market Cap:</b> ${stock.quote.marketCap}<br>
           <b>PE Ratio:</b> ${stock.quote.peRatio}<br>
           <b>Primary Exchange:</b> ${stock.quote.primaryExchange}<br>
           <b>Symbol:</b> ${stock.quote.symbol}<br>
           <b>Week 52 High:</b> ${stock.quote.week52High}<br>
           <b>Week 52 Low:</b> ${stock.quote.week52Low}<br>
           <b>YTD Change:</b> ${stock.quote.ytdChange}<br>
           <b>News:</b><br>
           `

           news = renderNews(stock.news.slice(0, 3))
           stockDiv.prepend(searchImg)
           stockDiv.append(news)
           userStocksUl.append(stockDiv)
           stockCollection.append(userStocksUl)
       }

function getStocks()
    {fetch(stocksUrl)
    .then(response => response.json())
    .then(data => {
        renderStocks(data)
    })
  }

function renderStocks(stocks){
   if(Array.isArray(stocks)){
     stocks.forEach(stock =>{
          renderStock(stock)
    })
   } else {
    alert("You are not tracking any stocks.")
   }
  }

function renderStock(stock){
    const stockDiv = document.createElement('div')
    button = document.createElement("button")
    button.setAttribute("type", "submit")
    button.setAttribute("id", `${stock.symbol}`)
    button.textContent = "View Market Data"

    stockDiv.innerHTML = `
    <h1>${stock.company_name}</h1><br>
    <button class="show-info">View Market Data</button>
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
    stockDiv.setAttribute(`id`, `${stock.symbol}`)

        stockCollection.append(stockDiv)

    }

})