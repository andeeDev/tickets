<?php


namespace App\Classes\Handler;


use App\Classes\SocketControllers\ProjectController;
use App\Classes\SocketControllers\TicketsController;

class Handler
{

    public function handle($message, $send, $responseWithError) {
        switch ($message["type"]) {
            case "projects.add":
                (new ProjectController())->addProject($message, $send, $responseWithError);
                break;
            case "projects.delete":
                (new ProjectController())->deleteProject($message, $send, $responseWithError);
                break;
            case "projects.title":
                (new ProjectController())->updateTitle($message, $send, $responseWithError);
                break;


            case "tickets.add":
                (new TicketsController())->create($message, $send, $responseWithError);
                break;
            case "tickets.delete":
                (new TicketsController())->delete($message, $send, $responseWithError);
                break;
            case "tickets.update":
                (new TicketsController())->update($message, $send, $responseWithError);
                break;


        }
    }

}
