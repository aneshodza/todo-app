using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Auth;

public class TokenService
{
    private readonly IConfigurationSection _jwtcfg;
    public TokenService(IConfiguration cfg) => _jwtcfg = cfg.GetSection("Jwt");

    public (string token, DateTime expiresAt)
        CreateAccessToken(IdentityUser user, TimeSpan? lifetime = null)
    {
        var issuer = _jwtcfg["Issuer"];
        var audience = _jwtcfg["Audience"];
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtcfg["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims =
            new List<Claim> { new(JwtRegisteredClaimNames.Sub, user.Id),
                          new(JwtRegisteredClaimNames.Email, user.Email!),
                          new(JwtRegisteredClaimNames.Jti,
                              Guid.NewGuid().ToString()) };

        var expires = DateTime.UtcNow.Add(lifetime ?? TimeSpan.FromMinutes(15));

        var jwt = new JwtSecurityToken(issuer: issuer, audience: audience,
                                       claims: claims, notBefore: DateTime.UtcNow,
                                       expires: expires, signingCredentials: creds);

        var token = new JwtSecurityTokenHandler().WriteToken(jwt);
        return (token, jwt.ValidTo);
    }
}
