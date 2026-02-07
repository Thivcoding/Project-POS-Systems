<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $primaryKey = 'payment_id';

    protected $fillable = [
        'sale_id',
        'payment_method',
        'paid_amount',
        'change_amount',
        'payment_date'
    ];

    protected $casts = [
        'payment_date' => 'datetime'
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class, 'sale_id');
    }
}
