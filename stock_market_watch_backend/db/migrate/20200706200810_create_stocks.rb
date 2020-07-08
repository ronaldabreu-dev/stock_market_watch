class CreateStocks < ActiveRecord::Migration[6.0]
  def change
    create_table :stocks do |t|
      t.float :avg_total_volume
      t.float :change_percent
      t.string :company_name
      t.float :latest_price
      t.float :latest_update
      t.float :market_cap
      t.float :pe_ratio
      t.string :primary_exchange
      t.string :symbol
      t.float :ytd_change
      t.string :news
      t.string :logo_url
      t.timestamps
    end
  end
end
