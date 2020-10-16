<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/
Broadcast::routes(['middleware' => ['web', 'auth']]);
Broadcast::channel('chat', \App\Broadcasting\MessagesChannel::class);
/*Broadcast::channel('chat.{task_id}', function(\App\User $user, int $task_id) {
    return true || false;
}); */

