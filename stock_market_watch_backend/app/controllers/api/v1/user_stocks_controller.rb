class Api::V1::UserStocksController < ApplicationController
def create
  @user_stock = UserStock.new
  coin = Coin.find_by(id: params[:id])
  @current_user.coins.push(coin)
end

private

def user_params
    params.require(:user_coin).permit!
end
end
