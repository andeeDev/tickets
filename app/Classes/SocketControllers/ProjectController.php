<?php


namespace App\Classes\SocketControllers;


use App\Classes\Services\ProjectService;
use App\Project;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use \GuzzleHttp\Client;
use \Exception;

class ProjectController
{
    private $service;

    public function __construct()
    {
        $this->service = new ProjectService();
    }

    public function getUserIdByToken($accessToken) {
        try {
            $client = new Client;
            $response = $client->request('GET', 'http://laravel.example.com/api/auth/user', [
                'headers' => [
                    'Accept' => 'application/json',
                    'Authorization' => 'Bearer '.$accessToken,
                ],
            ]);
            return json_decode($response->getBody())->id;
        } catch (Exception $e) {
            return null;
        }
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
            $obj = [];
            $obj["type"] = "projects.title";
            $obj["project"] = $project;
            $send(json_encode($obj));
        } catch (Exception $exception) {
            DB::rollBack();
            Log::channel('errorLogger')->error('Update title, transaction error ' .  $exception->getMessage());
            $responseWithError(json_encode(["error" => "Can't update title " . $exception->getMessage()]));
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
        } catch (Exception $exception) {
            DB::rollBack();
            Log::channel('errorLogger')->error('Delete project, transaction error');
            $responseWithError(json_encode(["error" => "Can't delete project" ]));
        }
    }

    public function addProject($message, $send, $responseWithError) {
        $validator = Validator::make($message, [
            'access_token' => 'required|string'
        ]);
        if ($validator->fails()) {
            Log::channel('errorLogger')->error('Add project, validation error', ['errors' => $validator->errors()]);
            $responseWithError(json_encode(["error" => "Data is not valid"]));
        }
        $access_token = $message['access_token'];
        DB::beginTransaction();
        try {
            $obj = [];
            $obj["type"] = "projects.add";
            $user_id = $this->getUserIdByToken($access_token);
            if(!$user_id) {
                Log::channel('errorLogger')->error('Failed to find user');
                $responseWithError(json_encode(["error" => "Failed to find user" ]));
            }
            $project = Project::create([
                'title' => '',
                'user_id' => $user_id
            ]);
            $obj["project"] = $project->load('users');
            DB::commit();
            $send(json_encode($obj));
        } catch (Exception $exception) {
            DB::rollBack();
            Log::channel('errorLogger')->error('Failed to add project, transaction error');
            $responseWithError(json_encode(["error" => "Failed to add project" ]));
        }
    }

}
