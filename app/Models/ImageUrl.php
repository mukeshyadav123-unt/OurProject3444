<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageUrl extends Model
{
    use HasFactory;
    protected $fillable = ['url' , 'product_id'];
    protected $hidden = ['id' , 'created_at' , 'updated_at' , 'product_id'];


    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
