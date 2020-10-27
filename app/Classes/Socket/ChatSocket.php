<?php


namespace App\Classes\Socket;


use App\Classes\Handler\Handler;
use App\Classes\Socket\Base\BaseSocket;
use App\Classes\Validation\StatusValidation\StatusConst;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use \SplObjectStorage;
use Ratchet\ConnectionInterface;
use \Exception;


class ChatSocket extends BaseSocket
{
    protected $clients;
    private $handler;

    public function __construct()
    {
        $this->clients = new SplObjectStorage();
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
        // validation jwt/auth ?
        try {
            $message_array = json_decode($msg, true);


            $validator = Validator::make(
                $message_array, [
                    'type' => ['required', 'string', Rule::in(StatusConst::getStatuses())]
                ]
            );
            if($validator->fails()) {
                return $this->sendError($from)(422,'Status is not valid');
            }

            // check token
            if(!array_key_exists('access_token', $message_array)) {
                return $this->sendError($from)(401,'Access token not found, search for it');
            }
            $user_id = $this->getUserIdByToken($message_array['access_token']);
            if($user_id) {
                return $this->handler->handle($message_array, $this->sendToOthers($from), $this->sendToUser($from));
            }
            return $this->sendError($from)(401,'Problems with access token, check it');
        } catch (Exception $exception) {
            $this->sendError($from)(422,'Parsing Error, check your json' . $exception->getMessage());
        }
    }

    public function sendError($from) {
        return function (int $status, string $message) use ($from) {
            try {
                $from->send(json_encode(['status' => $status, 'message' => $message]));
            } catch (Exception $exception) {
                Log::channel('errorLogger')->error('SendError method: Unable to send message' . $exception->getMessage());
            }
        };
    }

    public function sendToUser($from) {
        return function ($message) use ($from) {
            $from->send($message);
        };
    }



    public function onError(ConnectionInterface $conn, Exception $e)
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

}
