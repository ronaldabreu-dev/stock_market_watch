class UserStock < ApplicationRecord
    belongs_to :stock
    belongs_to :user
end
