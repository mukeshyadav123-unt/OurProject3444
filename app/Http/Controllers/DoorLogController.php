<?php

namespace App\Http\Controllers;

use App\Models\DoorLog;
use Illuminate\Http\Request;

class DoorLogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return DoorLog::all();
    }
}
