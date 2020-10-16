<?php

namespace App\Http\Controllers;


use App\Ticket;

class TicketsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Support\Collection
     */
    public function index()
    {
        /*return Project::find(12)->tickets()->delete();*/
        return Ticket::with(['projects' => function($query) {
            $query->select('id', 'title');
        }, 'users' => function($query) {
            $query->select('id', 'name', 'email', 'is_master', 'image');
        }])->get();
    }


}
