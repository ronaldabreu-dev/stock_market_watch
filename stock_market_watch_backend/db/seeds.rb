require "iex-ruby-client"
Stock.destroy_all
IEX::Api.configure do |config|
  config.publishable_token = 'pk_f57a13c9af324593872971b36ca28c8c' # defaults to ENV['IEX_API_PUBLISHABLE_TOKEN']
  config.secret_token = 'APIKEY' # defaults to ENV['IEX_API_SECRET_TOKEN']
  config.endpoint = 'https://cloud.iexapis.com/v1' # use 'https://sandbox.iexapis.com/v1' for Sandbox
end

client = IEX::Api::Client.new(
  publishable_token: 'pk_f57a13c9af324593872971b36ca28c8c',
  secret_token: 'APIKEY',
  endpoint: 'https://cloud.iexapis.com/v1'
)

top_ten = client.stock_market_list(:mostactive)

top_ten.each do |stock|
  logo = client.logo("#{stock["symbol"]}")
  news = client.news("#{stock["symbol"]}", 2)
puts stock
  Stock.create(
    symbol: stock.symbol
)

end
