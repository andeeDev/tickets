<?php


namespace App\Classes\Services;


use App\Project;
use App\Ticket;
use App\User;

class TicketService
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

    public function updateTicket($ticketArray, $token) {
        if(array_key_exists("project_name", $ticketArray)) {
            $project = Project::where('title', '=', $ticketArray["project_name"])->first();
            if(!$project) {
                $that_project = Project::create([
                    'title' => $ticketArray["project_name"],
                    'user_id' => $this->getUserId($token)
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

        $ticket_to_send = $ticket->with(['projects' => function($query) {
            $query->select('id', 'title');
        }, 'users' => function($query) {
            $query->select('id', 'name', 'email', 'is_master', 'image');
        }])->find($ticket->id);
        return $ticket_to_send;
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
