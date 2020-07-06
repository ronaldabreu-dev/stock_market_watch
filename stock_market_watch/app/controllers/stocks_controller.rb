class StocksController < ApplicationController
  def index
    @stocks = Stock.all
    respond_to do |format|
      format.json { render json: @resource }
    end
end
