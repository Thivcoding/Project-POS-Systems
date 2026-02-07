<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // REGISTER
    public function register(Request $request)
    {

        $data = $request->validate([
            'username' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    // LOGIN
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid Credentials'], 401);
        }

        $user = auth()->user();

        return response()->json([
            'message' => 'login successfully',
            'token' => $token,
            'users' => $user
        ]);
    }
}
