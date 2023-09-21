<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PassingPercentage extends Model
{
    use HasFactory;
    protected $fillable = ['teacher_id', 'flag', 'percentage'];
}
