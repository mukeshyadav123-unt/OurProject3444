<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function showAll()
    {
        if ($this->validateAdmin()) {
            return $this->validateAdmin();
        }

        return User::paginate(15);
    }

    public function showAdmins()
    {
        if ($this->validateAdmin()) {
            return $this->validateAdmin();
        }

        return User::where('is_admin', '=', 1)
            ->paginate(15);
    }

    public function show(User $user)
    {
        if ($this->validateAdmin()) {
            return $this->validateAdmin();
        }

        return $user;
    }


    public function storeUser()
    {
        if ($this->validateAdmin()) {
            return $this->validateAdmin();
        }

        request()->validate([
            'name' => ['required' , 'min:3' , 'max:100'],
            'email' =>['required' , 'email'],
            'password'         => ['required' , 'string' , 'min:8' ],
            'password_confirm' => ['required','same:password'],
            'is_admin' => ['required','boolean']
        ]);


        $user= User::where('email', request()->email)->first();
        if ($user) {
            return response([
                'message' => ['email already exist.']
            ], 401);
        }
        $user = User::create([
            'name' => request()->name,
            'email' => request()->email,
            'password' =>Hash::make(request()->password),
            'is_admin' =>request()->id_admin,
        ]);
        $token = $user->createToken('my-app-token')->plainTextToken;

        $response = [
                'user' => $user,
                'token' => $token
            ];

        return response($response, 201);
    }


    public function makeAdmin(User $user)
    {
        if ($this->validateAdmin()) {
            return $this->validateAdmin();
        }

        request()->validate([
            'admin_password' => ['required'],
        ]);

        $authed_user =Auth::user();


        if (!Hash::check(request()->admin_password, $authed_user->password)) {
            return response('wrong admin password ', 401);
        }
        $user->is_admin = true;
        return [
            'message'=> 'user now is admin',
            'user' => $user
        ];
    }




    public function destroy(User $user)
    {
        if ($this->validateAdmin()) {
            return $this->validateAdmin();
        }

        $user->delete();
        return "user deleted successfully";
    }

    protected function validateAdmin()
    {
        $authed_user =Auth::user();


        if ($authed_user['is_admin'] != 1) {
            return response('unauthorized', 401);
        }
        return null;
    }
}
