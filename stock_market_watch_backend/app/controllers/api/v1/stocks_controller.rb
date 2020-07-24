class Api::V1::StocksController < ApplicationController
  require "iex-ruby-client"

  IEX::Api.configure do |config|
    config.publishable_token = 'pk_f57a13c9af324593872971b36ca28c8c' # defaults to ENV['IEX_API_PUBLISHABLE_TOKEN']
    config.secret_token = 'APIKEY' # defaults to ENV['IEX_API_SECRET_TOKEN']
    config.endpoint = 'https://cloud.iexapis.com/v1' # use 'https://sandbox.iexapis.com/v1' for Sandbox
  end

  @@client = IEX::Api::Client.new(
    publishable_token: 'pk_f57a13c9af324593872971b36ca28c8c',
    secret_token: 'APIKEY',
    endpoint: 'https://cloud.iexapis.com/v1'
  )


  def index
    top_ten = @@client.stock_market_list(:mostactive)
    render json: top_ten
  end

  def show
    logo = @@client.logo("#{params[:id]}")
    render json: logo.url
  end

end
