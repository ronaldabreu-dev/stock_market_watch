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
      const moreInfo = document.createElement('div')
      const stockNewsUl = document.createElement('ul')

      moreInfo.className = "more-info"
        e.target.textContent = "Hide Market Data"
      newsArray = stockData.news.split("#<IEX::Resources::News ")
        newsArray.shift()
        newsArray.forEach(i => {
          i.slice(1, -3)
          let keyVal = i.split("=");
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
      e.target.textContent = "Hide Maket Data"
      if (stockCollection.id !== "myStocks"){
        button = document.createElement("button")
        button.setAttribute("type", "submit")
        button.setAttribute("id", "trackButton")
        button.textContent = "Start Tracking"
        stockDiv.childNodes[6].append(button)
      }
       console.log(stockCollection.id)

    console.log(stockDiv.childNodes[6])
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
      console.log(e.target.parentNode.childNodes)

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
            console.log('Success:', data);
            stockCollection.innerHTML = ""
            data.forEach(i => {
              getUserStock(i["symbol"])
              console.log(i["symbol"])
              x.push(i)
            });

       })
      .catch((error) => {
       console.error('Error:', error);
      })
      console.log(x)

    } else if (e.target.id === "logOut") {

      logOut(userName)

    } else if (e.target.id === "logIn") {
      e.preventDefault()
            userName = e.target.parentNode.childNodes[3][0].value
            userPassword = e.target.parentNode.childNodes[3][1].value
      setSession(userName, userPassword)

    } else if (e.target.id === "trackButton") {
                tracker(e)
    }

  })
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
   console.log(data);
     if(data[0] === "wrong password or username"){
       renderForm("signIn")
       form = document.querySelector(".form")
       form.innerHTML += `<br><h3style="text-align:center">${data[0]}<h3>`
     } else {
       console.log('Success:', data);
        location.reload();
      }
   })
 .catch((error) => {
   console.error('Error:', error);
 })

}
function tracker(e){
        const stockDataArray = e.target.parentNode.childNodes[15].innerText.split(": ");
         console.log(stockDataArray)
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
              console.log('Success:', data);
              stockCollection.innerHTML = ""
              data.forEach(i => {
                getStock(i["symbol"])
                console.log(i["symbol"])
                x.push(i)
              });

         })
       .catch((error) => {
         console.error('Error:', error);
       })
      console.log(x)
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
   console.log(data);
   errors = []
     if(Array.isArray(data)){
       renderForm("signUp")
       form = document.querySelector(".form")
        data.forEach(e => {
          console.log(e)
          errors.push(" " + e)
        });
       form.innerHTML += errors
     } else {
       console.log('Success:', data);
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
   // console.log('Success:', data);
     if(data[0] === "wrong password or username"){
       renderForm("signIn")
       form = document.querySelector(".form")
       form.innerHTML += `<br><h3style="text-align:center">${data[0]}<h3>`
     } else {
       console.log('Success:', data);

       renderUserPage(userName, data)
      }
   })
 .catch((error) => {
   console.error('Error:', error);
 })

}

function getUser(){
   user = {}
   stockCollection.innerHTML = ""
   const userStocksUrl = `http://localhost:3000/api/v1/users/${userName}`
   fetch(userStocksUrl)
   .then(response => response)
   .then(data => {
     console.log(data)
     stockCollection.innerHTML = ""
     data.forEach(i => {
       getStock(i["symbol"])
     })
   })
 }

function renderUserPage(userName, userStocks){
   console.log(userName)
   console.log(userStocks.length)
   stockCollection.innerHTML = `<h3>Welcome ${userName}!`
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
        console.log(data)
        renderSearch(data)
     })
    }

function getUserStock(stockSymbol){

         const stockUrl = `https://cloud.iexapis.com/stable/stock/${stockSymbol}/batch?types=quote,news,logo&range=1m&last=10&token=pk_f57a13c9af324593872971b36ca28c8c`
         fetch(stockUrl)
         .then(response => response.json())
         .then(data => {
           console.log(data)
           renderUserStocks(data)
        })
       }

function renderUserStocks(stock){
        let searchImg = document.createElement('img')
         let stockDiv = document.createElement('div')
         let userStocksUl = document.createElement('ul')
             setStockImage(stock.quote.symbol)
          searchImg.setAttribute("class", "company_logo")
          searchImg.src = stock.logo.url
            console.log(searchImg)
           stockDiv.setAttribute("class", "each-stock")
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
           userStocksUl.append(stockDiv)
           stockCollection.append(userStocksUl)

       }
function renderSearch(stock){
    stockCollection.innerHTML = ""

     let searchImg = document.createElement('img')
      let stockDiv = document.createElement('div')
      let userStocksUl = document.createElement('ul')
          setStockImage(stock.quote.symbol)
       searchImg.setAttribute("class", "company_logo")
       searchImg.src = stock.logo.url
         console.log(searchImg)
        stockDiv.setAttribute("class", "each-stock")
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
        userStocksUl.append(stockDiv)
        stockCollection.append(userStocksUl)

    }

function setStockImage(stockSymbol){
  let stock = document.getElementById(`${stockSymbol}`)
  let stockImg = document.createElement('img')
      fetch(`http://localhost:3000/api/v1/stocks/${stockSymbol}`)
       .then(response => response)
       .then(data => {
          stockImg.src = data.url
          stock.prepend(stockImg)
       })

    }

function getStocks(){fetch(stocksUrl)
    .then(response => response.json())
    .then(data => {
        renderStocks(data)
    })
  }

function renderStocks(stocks){
   console.log(stocks)
   if(Array.isArray(stocks)){
     stocks.forEach(stock =>{
          renderStock(stock)
    })
   } else {
    console.log("you are not tracking any stocks.")
   }
  }

function renderStock(stock){
    const stockDiv = document.createElement('div')
    button = document.createElement("button")
    button.setAttribute("type", "submit")
    button.setAttribute("id", `${stock.symbol}`)
    button.textContent = "View Market Data"
      // stockImg.src = img.url
      // stockNewsUl.className = "stock-news"
    // stockImg.src = stock.logo_url
    // stockImg.setAttribute("class", "company_logo")

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
    // stockDiv.prepend(stockImg)
        // stockDiv.append(stockNewsUl)


        stockCollection.append(stockDiv)
        // setStockImage(stock.symbol)

    }

})
