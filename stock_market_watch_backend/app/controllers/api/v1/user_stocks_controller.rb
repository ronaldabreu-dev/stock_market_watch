class Api::V1::UserStocksController < ApplicationController
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

def create
  @current_user = User.find_by(name: params[:stockObj][:"\"user_name\""])
 if @current_user.stocks.map{|s| s.symbol}.include?(params[:stockObj][:"\"symbol\""])

    render json: {"message": "Already tracking!"}
  else
  @stock = Stock.create(symbol: params[:stockObj][:"\"symbol\""])
  @current_user.stocks.push(@stock)
  render json: @current_user.stocks
  end

end

def show
  @current_user = User.find_by(name: params[:id])
 # @current_user = User.find_by(name: params[:stockObj][:"\"user_name\""])

 render json: @current_user.stocks
end
# {"\"symbol\""=>"AMD", "\"user_name\""=>"Ronal
# d"} permitted: true>
private

  def user_stocks_params
    params.require(:stockObj).permit!
  end


end
