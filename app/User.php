<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens;

    public function validateForPassportPasswordGrant($password)
    {
        return Hash::check($password, $this->password);
    }
    /*public function getImageAttribute($value)
    {
        if ($value === null) {
            return $this->parent->image;
        }

        return base64_encode($value);
    }*/
    //implement for searching
    /*protected static function boot()
    {
        parent::boot();

        // Сортировка по полю name в алфавитном порядке
        static::addGlobalScope('order', function (Builder $builder) {
            $builder->orderBy('name', 'asc');
        });
    }*/

    //imagecreatefromstring
    /*protected $defaults = array(
        'image' => 'null',
    );

    public function __construct(array $attributes = array())
    {
        $this->setRawAttributes($this->defaults, true);
        parent::__construct($attributes);
    }*/

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'country', 'sex', 'image'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
