<?php


namespace App\Services;


use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserService
{

    public function updateUser($request, $user) {
        $values = $request->only(['name', 'email', 'country', 'sex']);
        $password = $request->input('password');
        $password_confirmation = $request->input('password_confirmation');
        $user->update($values);

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
        return $user;
    }
}
