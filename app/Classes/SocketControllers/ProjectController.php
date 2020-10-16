<?php


namespace App\Classes\SocketControllers;


use App\Project;


class ProjectController
{
    public function updateTitle($message, $send) {
        $project = Project::find(intval($message["id"]));
        $project->title = $message["title"];
        $project->save();
        $send($project);
    }

    public function deleteProject($message, $send) {
        $obj = [];
        $obj["type"] = "projects.delete";
        $project_id = intval($message["id"]);
        $obj["project_id"] = $project_id;
        $project = Project::find($project_id);
        $project->tickets()->delete();
        Project::destroy($project_id);
        $send(json_encode($obj));
    }

}
