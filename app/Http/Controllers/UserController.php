<?php

namespace App\Http\Controllers;

use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function login()
    {
        $user = User::where('email', request()->email)->first();

        if (!$user || !Hash::check(request()->password, $user->password)) {
            return response([
                'message' => ['These credentials do not match our records.']
            ], 404);
        }

        $token = $user->createToken('my-app-token')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }



    public function showMe()
    {
        return request()->user();
    }



    public function destroy()
    {
        $authed_user = Auth::user();
        $authed_user->tokens()->delete();
        $authed_user->delete();

        return response()->json([
            'message' =>  "Your account has been deleted"
        ]);
    }

    public function update()
    {
        request()->validate([
            'current_password' => 'required',
            'email' => 'email',
            'name' => 'min:5',
            'new_password' => ['min:6', 'same:new_password_confirmation'],
            'new_password_confirmation' => ['min:6', 'required_with:new_password']
        ]);

        $authed_user = Auth::user();

        if (!Hash::check(request()->current_password, $authed_user->password)) {
            return response('current password is wrong', 401);
        }

        if (request()->email) {
            //check if  email is user before
            $user_with_email = User::where(['email' => request()->email])->first();
            if ($user_with_email && $user_with_email->id != $authed_user->id) {
                return response('Email already in use', 400);
            }

            $authed_user->email = request()->email;
        }
        if (request()->new_password) {
            $authed_user->password = Hash::make(request()->new_password);
        }

        if (request()->name) {
            $authed_user->name = request()->name;
        }
        $authed_user->save();
        return [
            'message' => "Your account has been updated",
            'user' => $authed_user
        ];
    }

    public function signup()
    {

        request()->validate([
            'name' => ['required', 'min:3', 'max:100'],
            'email' => ['required', 'email'],
            'password'         => ['required', 'string', 'min:8'],
            'password_confirm' => ['required', 'same:password'],

        ]);


        $user = User::where('email', request()->email)->first();
        if ($user) {
            return response([
                'message' => 'email already exist.'
            ], 400);
        }
        $user = User::create([
            'name' => request()->name,
            'email' => request()->email,
            'password' => Hash::make(request()->password),
        ]);

        $token = $user->createToken('my-app-token')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }
}
