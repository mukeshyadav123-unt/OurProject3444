<?php

namespace App\Http\Controllers;

use App\Models\Door;
use App\Models\DoorLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DoorController extends Controller
{
    public function index()
    {
        return [
            'is_closed' => Door::first()->is_closed
        ];
    }


    public function open()
    {
        $authed_user =Auth::user();
        $door = Door::first();
        if ($door->is_closed == 1) {
            // TODO: issue the resperri by to open is, then save the state to the database
            $door->is_closed = 0;
            $door->save();
            DoorLog::create([
                'name'=> $authed_user->name,
                'entered' => true,
                'is_camera' =>false
            ]);
            return ["Door is now open"];
        }

        return ['Door already Open'];
    }

    public function close()
    {
        $authed_user =Auth::user();
        $door = Door::first();
        if ($door->is_closed != 1) {
            // TODO: issue the resperri by to open is, then save the state to the database
            $door->is_closed = 1;
            $door->save();
            return ["Door is now closed"];
        }

        return ['Door already closed'];
    }
}
