<?php


namespace App\Classes\SocketControllers;


use App\Classes\Services\ProjectService;
use App\Project;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;


class ProjectController
{
    private $service;

    public function __construct()
    {
        $this->service = new ProjectService();
    }

    public function updateTitle($message, $send, $responseWithError) {
        $validator = Validator::make($message, [
            'id' => 'required|integer',
            'title' => 'required|string|max:50'
        ]);
        if ($validator->fails()) {
            Log::channel('errorLogger')->error('Update title, transaction error', ['errors' => $validator->errors()]);
            $responseWithError(json_encode(["error" => "Data is not valid"]));
        }
        DB::beginTransaction();
        try {
            $project = $this->service->updateProjectTitle($message["id"], $message["title"]);
            DB::commit();
            $send($project);
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::channel('errorLogger')->error('Update title, transaction error' .  $exception->getMessage());
            $responseWithError(json_encode(["error" => "Can't update title" . $exception->getMessage()]));
        }
    }

    public function deleteProject($message, $send, $responseWithError) {
        $validator = Validator::make($message, [
            'id' => 'required|integer'
        ]);
        if ($validator->fails()) {
            Log::channel('errorLogger')->error('Update title, transaction error', ['errors' => $validator->errors()]);
            $responseWithError(json_encode(["error" => "Data is not valid"]));
        }
        DB::beginTransaction();
        try {
            $obj = [];
            $obj["type"] = "projects.delete";
            $project_id = intval($message["id"]);
            $obj["project_id"] = $project_id;
            $project = Project::find($project_id);
            $project->tickets()->delete();
            Project::destroy($project_id);
            DB::commit();
            $send(json_encode($obj));
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::channel('errorLogger')->error('Delete project, transaction error');
            $responseWithError(json_encode(["error" => "Can't delete project" ]));
        }

    }

}
