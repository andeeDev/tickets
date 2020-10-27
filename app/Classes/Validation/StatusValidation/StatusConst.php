<?php


namespace App\Classes\Validation\StatusValidation;


class StatusConst
{
    public static $types;

    public static function getStatuses() {
        if(self::$types === null) {
            self::$types = array_merge(ProjectConst::$types,TicketConst::$types);
            return self::$types;
        }
        return self::$types;
    }
}
