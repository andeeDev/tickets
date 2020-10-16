<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use function GuzzleHttp\Promise\all;

class UserController extends Controller
{
    public function autoCompleteUsers(Request $request)
    {
        return response()->json(['users' => User::all()]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        return response()->json(['user' => Auth::user() ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }



    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        if($user->id !== intval($id)) {
            return response('Route doesn\'t respond token',404);
        }
        $validatedData = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string',
            /*'country' => 'nullable|string',
            'sex' => 'nullable|string'*/
        ]);
        $values = $request->only(['name', 'email', 'country', 'sex']);
        $user->update($values);
        $password = $request->input('password');
        $password_confirmation = $request->input('password_confirmation');
        if($password !== null) {
            if(!empty($password) &&
                !empty($password_confirmation) &&
                $password === $password_confirmation) {
                $user->password = Hash::make($password);
            } else {
                return response('Passwords doesn\'t matches', 422);
            }
        }

        if($request->has('image')) {
            $file = $request->file('image');
            $originalExtenstion = $file->getClientOriginalExtension();
            $newName = "av_" . uniqid() . "." . $originalExtenstion;
            Storage::disk('public')->put($newName,
                File::get($file));
            $user->image = $newName;
        }
        $user->save();
        return response($user, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
