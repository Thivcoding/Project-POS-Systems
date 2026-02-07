<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $primaryKey = 'product_id';

    protected $fillable = [
        'category_id',
        'product_code',
        'product_name',
        'price',
        'stock_qty',
        'image',
        'image_id', 
        'status'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'product_id');
    }

    public function saleDetails()
    {
        return $this->hasMany(SaleDetail::class, 'product_id');
    }
}
