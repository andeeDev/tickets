<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{

    private $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function index() {
        return response()->json(['user' => Auth::user() ]);
    }
    public function autoCompleteUsers() {
        return response()->json(['users' => User::all()]);
    }

    public function update(Request $request, $id) {
        $user = auth()->user();
        if($user->id !== intval($id)) {
            return response('Route doesn\'t respond token',404);
        }
        $validatedData = $request->validate([
            'name' => 'required|string|max:20',
            'email' => 'required|string|email',
            'sex' => 'nullable|string|in:F,M',
            'country' => 'nullable|string|max:30',
            'password' => 'nullable|string|max:20',
            'password_confirmation' => 'nullable|string|max:20',
            'image' => 'nullable|image'
        ]);

        $new_user = $this->service->updateUser($request, $user);
        return response($new_user, 200);
    }
}
