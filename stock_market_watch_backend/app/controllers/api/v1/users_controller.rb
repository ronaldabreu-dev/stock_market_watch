class Api::V1::UsersController < ApplicationController
  def create
    puts "ok"
          user = User.new(user_params)
          if user.save
            puts "ok"
            render json: user
          else
              puts @user.errors.full_messages
          end
  end

  def show
    user = User.find_by(name: params[:id])
    render json: user.stocks
  end

  private

    def user_params
        params.require(:user).permit!
    end


end
