<?php

namespace App\Repositories;

use App\Project;

class ProjectRepository
{
    public function getAllProjects() {
        return Project::with('users')->get('*');
    }

    public function autoCompleteByTitle(string $title) {
        return Project::where('title' ,'like', '%'.$title.'%');
    }

}
