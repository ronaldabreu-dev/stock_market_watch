class CreateStocks < ActiveRecord::Migration[6.0]
  def change
    create_table :stocks do |t|
      t.integer :avg_total_volume
      t.integer :change_percent
      t.string :company_name
      t.integer :latest_price
      t.integer :latest_update
      t.integer :market_cap
      t.integer :pe_ratio
      t.string :primary_exchange
      t.string :symbol
      t.integer :ytd_change
      t.string :news
      t.string :logo_url
      t.timestamps
    end
  end
end
