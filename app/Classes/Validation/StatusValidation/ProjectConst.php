<?php


namespace App\Classes\Validation\StatusValidation;


class ProjectConst
{
    const ADD = 'projects.add';
    const REMOVE = 'projects.delete';
    const UPDATE = 'projects.title';

    static $types = [self::ADD, self::REMOVE, self::UPDATE];
}
