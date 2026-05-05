<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

/**
 * Ported from: server/controllers/authController.js
 * Handles registration, login, and logout.
 * Replaces JWT-based auth with Laravel session-based auth.
 */
class AuthController extends Controller
{
    /**
     * Show login page.
     */
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Show registration page.
     */
    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle login request.
     * Ported from: authController.login()
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Invalid Credentials'],
            ]);
        }

        Auth::login($user);
        $request->session()->regenerate();

        // Redirect based on role
        return redirect()->intended($this->getDashboardRoute($user->role))
            ->with('message', 'Welcome back, ' . $user->username . '! We\'re glad to see you again.');
    }

    /**
     * Handle registration request.
     * Ported from: authController.register()
     */
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:6',
            'email'    => 'nullable|email',
            'phone'    => 'nullable|string',
        ]);

        $user = User::create([
            'username' => $request->username,
            'password' => $request->password, // Auto-hashed by User model cast
            'role'     => 'Client', // Public registration is always Client
            'email'    => $request->email,
            'phone'    => $request->phone,
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect('/')
            ->with('message', 'Welcome to Eloquente Catering, ' . $user->username . '! Your account is ready — let\'s plan something special.');
    }

    /**
     * Handle logout request.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Get dashboard route based on user role.
     */
    private function getDashboardRoute(string $role): string
    {
        return match ($role) {
            'Client'     => '/',
            'Marketing'  => '/dashboard/ops',
            'Accounting' => '/dashboard/finance',
            'Admin'      => '/dashboard/admin',
            default      => '/',
        };
    }
}
