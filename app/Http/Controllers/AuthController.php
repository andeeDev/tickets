<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;
use \App\User;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh(Request $request)
    {
        $http = new \GuzzleHttp\Client;
        $response = $http->post('http://laravel.example.com/oauth/token', [
            'form_params' => [
                'grant_type' => 'refresh_token',
                'refresh_token' => $request->input('refresh_token'),
                'client_id' => 1,
                'client_secret' => env("APP_AUTH_CLIENT"),
                'scope' => '',
            ],
        ]);
        $response_array = json_decode((string) $response->getBody(), true);
        return $this->respondWithTokens(
            auth()->user(),
            $response_array['access_token'],
            $response_array['refresh_token'],
            $response_array['expires_in']);
        //response()->json(['rs' => $user ,'token' => $user->createToken('Personal Access Token ') ]);//$this->respondWithToken($user->createToken('Personal Access Token ' ));
    }



    /**
     * Create user
     *
     * @param  [string] name
     * @param  [string] email
     * @param  [string] password
     * @param  [string] password_confirmation
     * @return [string] message
     */
    public function registration(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:users',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|confirmed'
        ]);
        $user = new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);
        $user->save();
        return response()->json([
            'message' => 'Successfully created user!'
        ], 201);
    }

    /**
     * Login user and create token
     *
     * @param  [string] email
     * @param  [string] password
     * @param  [boolean] remember_me
     * @return [string] access_token
     * @return [string] token_type
     * @return [string] expires_at
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);
        $credentials = request(['email', 'password']);
        if (!Auth::attempt($credentials))
            return response()->json([
                'message' => 'User was not found'
            ], 401);
        try {
            $http = new \GuzzleHttp\Client;
            $response = $http->post('http://laravel.example.com/oauth/token', [
                'form_params' => [
                    'grant_type' => 'password',
                    'client_id' => '1',
                    'client_secret' => env("APP_AUTH_CLIENT"),
                    'username' => $request->input('email'),
                    'password' => $request->input('password'),
                    'scope' => '',
                ],
            ]);
        } catch (GuzzleException $exception){
            return response('Guzzle unathorize' .  $exception->getMessage(), 401);
        }
        $response_array = json_decode($response->getBody(), true);
        return $this->respondWithTokens(auth()->user(),
            $response_array['access_token'],
            $response_array['refresh_token'],
            $response_array['expires_in']);
    }

    /**
     * Logout user (Revoke the token)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse [string] message
     */
    public function logout(Request $request)
    {
        $tokenRepository = app('Laravel\Passport\TokenRepository');
        $refreshTokenRepository = app('Laravel\Passport\RefreshTokenRepository');
        $tokenId = (new \Lcobucci\JWT\Parser())->parse($request->input('access_token'))->getClaim('jti');//->getHeader('jti');
        $tokenRepository->revokeAccessToken($tokenId);
        $refreshTokenRepository->revokeRefreshTokensByAccessTokenId($tokenId);
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function user(Request $request) {
        return response(auth()->user(), 200);
    }



    protected function respondWithTokens($user, $token, $refreshToken, $expire){
        return response()->json([
            'user' => $user,
            'tokens' => (object)[
                'access_token' => $token,
                'refresh_token' => $refreshToken,
                'token_type' => 'bearer',
                'expires_in' =>Carbon::parse(
                    Carbon::now()->addSeconds($expire)
                )->toDateTimeLocalString()
            ]
        ]);
    }
}
