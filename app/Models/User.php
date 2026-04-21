<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'username',
        'password',
        'email',
        'phone',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    // ─── Relationships ───

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function foodTastings()
    {
        return $this->hasMany(FoodTasting::class);
    }

    // ─── Role Helpers ───

    public function isAdmin(): bool
    {
        return $this->role === 'Admin';
    }

    public function isMarketing(): bool
    {
        return $this->role === 'Marketing';
    }

    public function isAccounting(): bool
    {
        return $this->role === 'Accounting';
    }

    public function isClient(): bool
    {
        return $this->role === 'Client';
    }
}
