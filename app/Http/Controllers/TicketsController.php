<?php

namespace App\Http\Controllers;

use App\Repositories\TicketsRepository;

class TicketsController extends Controller
{
    private $repository;

    function __construct(TicketsRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index() {
        return $this->repository->getAllTickets();
    }
}
