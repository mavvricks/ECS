<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'dish_id',
        'name',
        'category',
        'cost_per_head',
        'price_adj',
        'image',
        'description',
        'is_best_seller',
    ];

    protected function casts(): array
    {
        return [
            'cost_per_head'  => 'decimal:2',
            'price_adj'      => 'decimal:2',
            'is_best_seller' => 'boolean',
        ];
    }
}
