Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :comments
    end
  end
  namespace :api do
    namespace :v1 do
      resources :user_stocks
    end
  end
  namespace :api do
    namespace :v1 do
      resources :users
    end
  end
  namespace :api do
    namespace :v1 do
      resources :stocks
    end
  end
  namespace :api do
    namespace :v1 do
      resources :sessions
    end
  end

  # resources :comments
  # resources :user_stocks
  # resources :stocks
  # resources :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
