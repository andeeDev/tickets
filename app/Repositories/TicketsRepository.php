<?php


namespace App\Repositories;


use App\Ticket;

class TicketsRepository
{
    // name of method
    public function getAllTickets() {
        return Ticket::with(['projects' => function($query) {
            $query->select('id', 'title');
        }, 'users' => function($query) {
            $query->select('id', 'name', 'email', 'is_master', 'image');
        }])->get();
    }

}
