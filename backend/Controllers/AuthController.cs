using Backend.Auth;
using Backend.Entities.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly UserManager<IdentityUser> _users;
  private readonly TokenService _tokens;

  public AuthController(UserManager<IdentityUser> users, TokenService tokens)
  {
    _users = users;
    _tokens = tokens;
  }

  [AllowAnonymous]
  [HttpPost("register")]
  public async Task<IActionResult> Register([FromBody] RegisterRequest req)
  {
    var emailExists = await _users.FindByEmailAsync(req.Email);
    if (emailExists is not null)
    {
      return Conflict(new { message = "Email already taken" });
    }

    var usernameExists = await _users.FindByNameAsync(req.Username);
    if (usernameExists is not null)
    {
      return Conflict(new { message = "Username already taken" });
    }

    if (req.Username.Contains("@"))
    {
      return BadRequest(new { message = "Username cannot have an @" });
    }

    var user = new IdentityUser { UserName = req.Username, Email = req.Email };
    var result = await _users.CreateAsync(user, req.Password);
    if (!result.Succeeded) return BadRequest(result.Errors);

    return Ok(new { message = "Registered" });
  }

  [AllowAnonymous]
  [HttpPost("login")]
  public async Task<IActionResult> Login([FromBody] LoginRequest req)
  {
    IdentityUser? user;
    if (req.Identifier.Contains("@"))
    {
      user = await _users.FindByEmailAsync(req.Identifier);
    }
    else
    {
      user = await _users.FindByNameAsync(req.Identifier);
    }

    if (user is null)
    {
      return Unauthorized(new { message = "Invalid credentials" });
    }

    var ok = await _users.CheckPasswordAsync(user, req.Password);
    if (!ok)
    {
      return Unauthorized(new { message = "Invalid credentials" });
    }

    TimeSpan? lifetime = null;
    if (req.RememberMe)
    {
      lifetime = TimeSpan.FromHours(24);
    }

    var (token, expiresAt) = _tokens.CreateAccessToken(user, lifetime);

    return Ok(new AuthResponse(token, expiresAt));
  }
}

