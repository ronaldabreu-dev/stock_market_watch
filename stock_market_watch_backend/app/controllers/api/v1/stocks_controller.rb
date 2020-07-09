class Api::V1::StocksController < ApplicationController
  require "iex-ruby-client"

  IEX::Api.configure do |config|
    config.publishable_token = 'pk_f57a13c9af324593872971b36ca28c8c' # defaults to ENV['IEX_API_PUBLISHABLE_TOKEN']
    config.secret_token = 'sk_d26d6dcd69c54f3e9308330ba8339332' # defaults to ENV['IEX_API_SECRET_TOKEN']
    config.endpoint = 'https://cloud.iexapis.com/v1' # use 'https://sandbox.iexapis.com/v1' for Sandbox
  end

  @@client = IEX::Api::Client.new(
    publishable_token: 'pk_f57a13c9af324593872971b36ca28c8c',
    secret_token: 'sk_d26d6dcd69c54f3e9308330ba8339332',
    endpoint: 'https://cloud.iexapis.com/v1'
  )


  def index
    stocks = Stock.all

    render json: stocks
  end

  def show
    # stock = Stock.find(params[:id])
    logo = @@client.logo("#{params[:id]}")
    render json: logo
  end

end
