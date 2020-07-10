class Api::V1::UsersController < ApplicationController
  skip_before_action :auth_user, only: [:new, :create]
  before_action :find_user, only: [:edit, :update, :destroy]

  def create
    u_params = {}
    u_params["name"] = params["name"]
    u_params["password"] = params["password"]
    puts u_params
          user = User.new(u_params)
          if user.save
            puts "ok"
            puts u_params
            render json: user
          else
            puts "no"
                puts user_params
            puts user.errors.full_messages
            render json: user.errors.full_messages
          end
  end

  def show
    if @user
    render json: user
    puts "ok √"
   else
    render json: "user not found"
   end
  end

  private

    def user_params
      params.require(:user).permit!
    end

    def find_user
     @user = User.find(params[:id])
    end

end
