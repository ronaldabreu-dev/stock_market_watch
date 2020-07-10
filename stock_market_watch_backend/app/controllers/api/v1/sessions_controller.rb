class Api::V1::SessionsController < ApplicationController
 skip_before_action :auth_user, only: [:new, :create]

  def logout
    session.delete(:user_id)

    redirect_to new_login_path
  end

  def new
  end

  def create
    user = User.find_by(name: params[:session][:name]) #&& params[:session][:password])
    puts "ok √"
    puts user
     if user && user.authenticate(params[:session][:password])
    # puts session[:user_id] = user.id
      puts "ok"
     render json: user.stocks
      # redirect_to user
    else
      puts "no"
      puts user.errors.full_messages
      full_message = ["wrong password or username"]
      render json: full_message
    end
  end

end
