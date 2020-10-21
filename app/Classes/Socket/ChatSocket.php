<?php


namespace App\Classes\Socket;


use App\Classes\Handler\Handler;
use App\Classes\Socket\Base\BaseSocket;
use App\Project;
use Ratchet\ConnectionInterface;

class ChatSocket extends BaseSocket
{
    protected $clients;
    private $handler;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage();
        $this->handler = new Handler();
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
    }

    public  function sendToOthers($from)  {
        return function($msg) use ($from){
            foreach($this->clients as $client) {
                //if($from !== $client) {
                    $client->send($msg);
                //}
            }
        };
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $this->handler->handle(json_decode($msg, true),
            $this->sendToOthers($from));

    }



    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "Error {$e->getMessage()} \n";
        $conn->close();

    }

    public function onClose(ConnectionInterface $conn)
    {
        echo "Connection closed {$conn->resourceId} \n";
        $this->clients->detach($conn);
        $conn->close();
    }


}