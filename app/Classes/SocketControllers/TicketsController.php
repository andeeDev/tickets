<?php


namespace App\Classes\SocketControllers;



use App\Classes\ApiTokenCookieFactory;
use App\OauthAccessToken;
use App\Project;
use App\Ticket;
use App\User;
use Firebase\JWT\JWT;
use Illuminate\Auth\AuthenticationException;
use mysql_xdevapi\Exception;

class TicketsController
{
    public function getUserId($accessToken) {
        try {
            $client = new \GuzzleHttp\Client;
            $response = $client->request('GET', 'http://laravel.example.com/api/auth/user', [
                'headers' => [
                    'Accept' => 'application/json',
                    'Authorization' => 'Bearer '.$accessToken,
                ],
            ]);
            return json_decode($response->getBody())->id;
        } catch (\Exception $e) {
            return null;
        }

    }



    public function create($message, $send) {
        $ticket = new Ticket();
        if($user_id = $this->getUserId($message["access_token"])){
            $ticket->save();
            $ticket->users()->attach($user_id, ['is_master' => 1]);
            $id = $ticket["id"];
            $jsonObject = [];
            $jsonObject["type"] = "tickets.add";
            $jsonObject["ticket"] = Ticket::with(['projects' => function($query) {
                $query->select('id', 'title');
            }, 'users' => function($query) {
                $query->select('id', 'name', 'email', 'is_master', 'image');
            }])->find($id);
            //creator
            $send(json_encode($jsonObject));
        }


    }

    public function delete($message, $send) {
        $ticket = Ticket::find($message["id"]);
        $id = $message["id"];
        $ticket->users()->detach();
        $ticket->destroy($id);
        $jsonObject = [];
        $jsonObject["type"] = "tickets.delete";
        $jsonObject["ticket"] = $ticket;
        $send(json_encode($jsonObject));
    }

    public function update($message, $send) {
        $ticketArray = $message["ticket"];
        //create project
        if(array_key_exists("project_name", $ticketArray)) {
            $project = Project::where('title', '=', $ticketArray["project_name"])->first();
            if(!$project) {
                $that_project = Project::create([
                    'title' => $ticketArray["project_name"],
                    'user_id' => $this->getUserId($message["access_token"])
                ]);
                $ticketArray["project_id"] = $that_project->id;
            } else {
                $ticketArray["project_id"] = $project->id;
            }
            unset($ticketArray["project_name"]);
            unset($ticketArray["projects"]);
        }
        unset($ticketArray["projects"]);
        $ticket = Ticket::find($ticketArray["id"]);
        unset($ticketArray["id"]);
        $ticketArray["priority"] = $this->convert_priority($ticketArray["priority"]);
        $ticketArray["status"] = $this->convert_status($ticketArray["status"]);
        $creatorId = null;
        $assignerId = null;

        foreach($ticketArray["users"] as $user) {
            if (intval($user["is_master"]) === 1) {
                $creatorId = User::select("id")->where("email", $user["email"])->first()->id;
            }
            if (intval($user["is_master"]) === 0 && array_key_exists("email", $user)) {
                $assignerId = User::select("id")->where("email", $user["email"])->first()->id;
            }
        }
        $ticket->users()->detach();
        $ticket->users()->attach([$creatorId => ["is_master" => '1']]);
        if($assignerId) {
            $ticket->users()->attach([$assignerId => ["is_master" => '0']]);
        }
        /*$ticket->save();*/
        $ticket->update($ticketArray);
        /*$ticket->save();*/
        $jsonObject = [];
        $jsonObject["type"] = "tickets.update";
        $ticket_to_send = $ticket->with(['projects' => function($query) {
            $query->select('id', 'title');
        }, 'users' => function($query) {
            $query->select('id', 'name', 'email', 'is_master', 'image');
        }])->find($ticket->id);
        $jsonObject["ticket"] = $ticket_to_send;
        $send(json_encode($jsonObject));
    }

    function convert_priority($priority) {
        switch ($priority) {
            case "High":
                return "high";
            case "Middle":
                return "normal";
            case "Low":
                return "low";
            default:
                return "";
        }
    }
    function convert_status($status) {
        switch ($status) {
            case "New":
                return "new";
            case "In Progress":
                return "progress";
            case "Done":
                return "done";
            default:
                    return "";
        }
    }
}
