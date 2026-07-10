# Authentication Feature

## Overview
Complete authentication system using JWT tokens.

## Login Flow
1. User submits email + password
2. Server validates credentials against database
3. JWT access token (15min) + refresh token (7 days) issued
4. Tokens stored in httpOnly cookies

## Token Structure
- **Access Token**: Contains user ID, email, permissions
- **Refresh Token**: Used to obtain new access token

## Security
- Passwords hashed with bcrypt (12 rounds)
- Tokens signed with RS256
- CORS restricted to known origins
- Rate limiting on login endpoint
