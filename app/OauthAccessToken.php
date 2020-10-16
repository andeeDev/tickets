<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OauthAccessToken extends Model
{
    protected $table = 'oauth_access_tokens';

    public function user() {
        return $this->belongsTo(User::class, 'client_id', 'id');
    }
}
