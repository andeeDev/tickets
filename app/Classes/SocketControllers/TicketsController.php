<?php


namespace App\Classes\SocketControllers;

use App\Classes\Services\TicketService;
use App\Ticket;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;


class TicketsController
{

    private $service;
    public function __construct()
    {
        $this->service = new TicketService();
    }

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



    public function create($message, $send, $responseWithError) {
        $validator = Validator::make($message, [
            'access_token' => 'required|string'
        ]);
        if ($validator->fails()) {
            Log::channel('errorLogger')->error('Create ticket, validation error', ['errors' => $validator->errors()]);
            $responseWithError(json_encode(["error" => "Data is not valid"]));
        }
        DB::beginTransaction();
        try {
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
                DB::commit();
                //creator
                $send(json_encode($jsonObject));
            }
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::channel('errorLogger')->error('Create Ticket, transaction error');
            $responseWithError(json_encode(["error" => "Can't create ticket" ]));
        }
    }

    public function delete($message, $send, $responseWithError) {
        $validator = Validator::make($message, [
            'access_token' => 'required|string'
        ]);
        if ($validator->fails()) {
            Log::channel('errorLogger')->error('Delete ticket, validation error', ['errors' => $validator->errors()]);
            $responseWithError(json_encode(["error" => "Data is not valid"]));
        }
        DB::beginTransaction();
        try {
            $ticket = Ticket::find($message["id"]);
            $id = $message["id"];
            $ticket->users()->detach();
            $ticket->destroy($id);
            $jsonObject = [];
            $jsonObject["type"] = "tickets.delete";
            $jsonObject["ticket"] = $ticket;
            DB::commit();
            $send(json_encode($jsonObject));
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::channel('errorLogger')->error('Delete Ticket, transaction error' . $exception->getMessage());
            $responseWithError(json_encode(["error" => "Can't delete ticket" ]));
        }

    }

    public function update($message, $send, $responseWithError) {
        $validator = Validator::make($message, [
            'access_token' => 'required|string',
            'ticket' => 'required|array',
            'ticket.id' => 'required|integer',
            'ticket.title' => 'nullable|string|max:50',
            'ticket.subject' => 'nullable|string|max:50',
            'ticket.description' => 'nullable|string|max:50',
            'ticket.status' => 'nullable|in:Done,In Progress,New',
            'ticket.priority' => 'nullable|in:High,Middle,Low',
            'ticket.users.id' => 'exists:users,id',
            'ticket.users.name' => 'nullable|string',
            'ticket.users.email' => 'nullable|string|email',
            'ticket.users.is_master' => 'nullable|integer|in:1,0',
            'ticket.users.image' => 'nullable'
        ]);
        if ($validator->fails()) {
            Log::channel('errorLogger')->error('Update ticket, validation error', ['errors' => $validator->errors()]);
            $responseWithError(json_encode(["error" => "Data is not valid"]));
        }
        DB::beginTransaction();
        try {
            $ticket_to_send = $this->service->updateTicket($message["ticket"], $message["access_token"]);
            $jsonObject = [];
            $jsonObject["type"] = "tickets.update";
            $jsonObject["ticket"] = $ticket_to_send;
            DB::commit();
            $send(json_encode($jsonObject));
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::channel('errorLogger')->error('Update Ticket, transaction error' . $exception->getMessage());
            $responseWithError(json_encode(["error" => "Can't Update ticket" ]));
        }

    }


}
