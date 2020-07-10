class UserStock < ApplicationRecord
    belongs_to :stock
    belongs_to :user

  validates :stock_id, uniqueness: true
end
