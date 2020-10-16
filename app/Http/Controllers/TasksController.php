<?php

namespace App\Http\Controllers;

use App\Events\ChatMessage;
use Illuminate\Http\Request;

class TasksController extends Controller
{
    public function comment(Request $request)
    {
        /**
         * Валидация. Добавляю сообщение в базу,
         * получаю модель Comment $comment с сообщением
         */

        event(new ChatMessage());
        // Это для примера.
        // Отправка сообщения всем активным пользователям канала

        // broadcast(new ChatMessage())->toOthers();
        // Отправляю сообщение всем,
        // кроме текущего пользователя
    }
}
