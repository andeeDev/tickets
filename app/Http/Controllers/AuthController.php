<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;
use \App\User;
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    /*public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'registration', ]]);
    }*/



    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh(Request $request)
    {
        /*$user = $request->user();
        $user->token()->revoke();*/
        $http = new \GuzzleHttp\Client;
        $response = $http->post('http://laravel.example.com/oauth/token', [
            'form_params' => [
                'grant_type' => 'refresh_token',
                'refresh_token' => $request->input('refresh_token'),
                'client_id' => 1,
                'client_secret' => 'v92BIbPSMzDEBp14bvi3atpWLL72CafCY82d4WDr',
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
                    'client_secret' => 'MBtRwn3yLQqcMycmPcBYHyTaf3wilwzyrmdlEoZI',
                    'username' => $request->input('email'),
                    'password' => $request->input('password'),
                    'scope' => '',
                ],
            ]);
        } catch (GuzzleException $exception){
            return response('Guzzle unathorize', 401);
        }

        //$user = $request->user();
        //$tokenResult = $user->createToken('Personal Access Token ' . $request->input('email'));
        //$token = $tokenResult->token;
        //$token->expires_at = Carbon::now()->addWeek();
        //if ($request->remember_me)
            //$token->expires_at = Carbon::now()->addWeeks(1);
        //$token->save();
        $response_array = json_decode($response->getBody(), true);
        return $this->respondWithTokens(auth()->user(),
            $response_array['access_token'],
            $response_array['refresh_token'],
            $response_array['expires_in']);//$this->respondWithToken($response->, $response->refresh_token, $response->expire);
        /*response()->json([
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => //Carbon::parse(
                $tokenResult->token->expires_at
            //)->toDateTimeString()
        ]);*/
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
