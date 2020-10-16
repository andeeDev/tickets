<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{

    public $timestamps = false;

    protected $fillable = ['title', 'user_id'];

    public function users() {
        return $this->belongsTo(User::class, 'user_id', 'id', '');
    }

    public function tickets() {
        return $this->hasMany(Ticket::class, 'project_id', 'id');
    }


}
