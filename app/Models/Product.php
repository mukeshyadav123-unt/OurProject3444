<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = ['name' , 'description' , 'cost' , 'tag_id'];

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }
}
