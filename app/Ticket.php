<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{


    public $timestamps = false;


    protected $fillable = ['title', 'subject',
        'description', 'status',
        'priority', 'project_id'];

    public function getStatusAttribute($value)
    {
         switch ($value) {
            case "new":
                return "New";
             case "progress":
                 return "In Progress";
             case "done":
                 return "Done";
             default:
                 return "";
        }
    }
    public function getPriorityAttribute($value)
    {
        switch ($value) {
            case "high":
                return "High";
            case "normal":
                return "Middle";
            case "low":
                return "Low";
            default:
                return "";
        }
    }

    public function projects() {
        return $this->belongsTo(Project::class,
            'project_id', 'id');
    }

    public function users() {
        return $this->belongsToMany(User::class, 'user_ticket',
            'ticket_id', 'user_id', 'id');
    }


}
