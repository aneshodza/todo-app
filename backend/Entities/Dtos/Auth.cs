namespace Backend.Entities.Dtos;

public record RegisterRequest(string Email, string Username, string Password);
public record LoginRequest(string Identifier, string Password, bool RememberMe);
public record AuthResponse(string AccessToken, DateTime ExpiresAt);
