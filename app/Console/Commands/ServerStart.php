<?php

namespace App\Console\Commands;

use App\Classes\Socket\ChatSocket;
use Illuminate\Console\Command;
use ParagonIE\Sodium\Core\Curve25519\H;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

class ServerStart extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'socket:start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Start Server');

        $server = IoServer::factory(
            new HttpServer(
                new WsServer(
                    new ChatSocket()
                )
            ),
            8080
        );
        $server->run();
    }
}
