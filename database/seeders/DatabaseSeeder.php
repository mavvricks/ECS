<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Ported from: server/db/setup.js
 * Seeds the 4 default users with role 'Admin' (standardized from 'Superadmin').
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $defaultUsers = [
            ['username' => 'admin',      'role' => 'Admin'],
            ['username' => 'marketing',  'role' => 'Marketing'],
            ['username' => 'accounting', 'role' => 'Accounting'],
            ['username' => 'client',     'role' => 'Client'],
        ];

        foreach ($defaultUsers as $userData) {
            User::firstOrCreate(
                ['username' => $userData['username']],
                [
                    'password' => 'password123', // Auto-hashed by User model 'hashed' cast
                    'role'     => $userData['role'],
                ]
            );

            $this->command->info("Seeded user: {$userData['username']} ({$userData['role']})");
        }
    }
}
