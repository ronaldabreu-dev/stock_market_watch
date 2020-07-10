class ApplicationController < ActionController::API
  before_action :get_user
before_action :auth_user

def get_user
  # @current_user = User.find(session[:user_id])
  @current_user = User.find_by(id: session[:user_id])
end


def auth_user
  if @current_user
    # Continue on into app
  else
    puts "user Authorized"
  end
end

end
