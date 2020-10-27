<?php


namespace App\Classes\Services;


use App\Project;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    public function updateProjectTitle(int $id, string $title) : Project {
        $project = Project::find($id);
        $project->title = $title;
        $project->save();
        return $project;
    }

}
