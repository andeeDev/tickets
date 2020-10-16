<?php


namespace App\Classes\Handler;


use App\Classes\SocketControllers\ProjectController;
use App\Classes\SocketControllers\TicketsController;

class Handler
{

    public function handle($message, $send) {
        switch ($message["type"]) {
            case "projects.title":
                (new ProjectController())->updateTitle($message, $send);
                break;
            case "projects.delete":
                (new ProjectController())->deleteProject($message, $send);
                break;
            case "tickets.add":
                (new TicketsController())->create($message, $send);
                break;
            case "tickets.delete":
                (new TicketsController())->delete($message, $send);
                break;
            case "tickets.update":
                (new TicketsController())->update($message, $send);
                break;
        }
    }

}
