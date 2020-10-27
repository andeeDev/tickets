<?php

namespace App\Http\Controllers;

use App\Repositories\ProjectRepository;
use Illuminate\Http\Request;

class ProjectsController extends Controller
{
    private $repository;

    function __construct(ProjectRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index() {
        return $this->repository->getAllProjects();
    }

    public function autoComplete(Request $request) {
        return $this->repository->autoCompleteByTitle($request->input('value'));
    }
}
