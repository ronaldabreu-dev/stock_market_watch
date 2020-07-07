require "iex-ruby-client"
Stock.destroy_all
IEX::Api.configure do |config|
  config.publishable_token = 'pk_f57a13c9af324593872971b36ca28c8c' # defaults to ENV['IEX_API_PUBLISHABLE_TOKEN']
  config.secret_token = 'sk_d26d6dcd69c54f3e9308330ba8339332' # defaults to ENV['IEX_API_SECRET_TOKEN']
  config.endpoint = 'https://cloud.iexapis.com/v1' # use 'https://sandbox.iexapis.com/v1' for Sandbox
end

client = IEX::Api::Client.new(
  publishable_token: 'pk_f57a13c9af324593872971b36ca28c8c',
  secret_token: 'sk_d26d6dcd69c54f3e9308330ba8339332',
  endpoint: 'https://cloud.iexapis.com/v1'
)

top_ten = client.stock_market_list(:mostactive)

top_ten.each do |stock|
  logo = client.logo("#{stock["symbol"]}")
  news = client.news("#{stock["symbol"]}", 5)

  Stock.create(
    company_name: stock.company_name,
    avg_total_volume: stock.avg_total_volume,
    change_percent: stock.change_percent,
    latest_price: stock.latest_price,
    latest_update: stock.latest_update,
    market_cap: stock.market_cap,
    pe_ratio: stock.pe_ratio,
    primary_exchange: stock.primary_exchange,
    symbol: stock.symbol,
    ytd_change: stock.ytd_change,
    news: news,
    logo_url: logo.url
)

end
