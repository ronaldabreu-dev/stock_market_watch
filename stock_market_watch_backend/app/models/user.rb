class User < ApplicationRecord
  has_secure_password
    has_many :user_stocks
    has_many :stocks, through: :user_stocks
    has_many :comments


  validates :name, presence: true
  validates :name, uniqueness: true
  validates :password, presence: true, length: { minimum: 6 }
end
