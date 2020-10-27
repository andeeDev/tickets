<?php


namespace App\Classes\Validation\StatusValidation;


class TicketConst
{
    const ADD = 'tickets.add';
    const REMOVE = 'tickets.delete';
    const UPDATE = 'tickets.update';

    static $types = [self::ADD, self::REMOVE, self::UPDATE];
}
