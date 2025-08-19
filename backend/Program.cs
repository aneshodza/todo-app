using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Backend.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(
    opt => opt.UseSqlite(
        builder.Configuration.GetConnectionString("Default") ??
        throw new ArgumentException("Database connetion not provided")));

builder.Services
    .AddIdentityCore<IdentityUser>(opt =>
    {
        opt.Password.RequiredLength = 6;
        opt.Password.RequireNonAlphanumeric = false;
        opt.Password.RequireUppercase = false;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager();

var jwt = builder.Configuration.GetSection("Jwt");
var issuer = jwt["Issuer"] ?? throw new ArgumentException("JWT Issuer not defined");
var audience = jwt["Audience"] ?? throw new ArgumentException("JWT Audience not defined");
var strKey = jwt["Key"] ?? throw new ArgumentException("JWT Key not defined");
var key = Encoding.UTF8.GetBytes(strKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = issuer,
            ValidAudience = audience,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("ng", p => p.WithOrigins("http://localhost:4200")
                                 .AllowAnyHeader()
                                 .AllowAnyMethod()
                                 .AllowCredentials());
});

builder.Services.AddControllers();
builder.Services.AddScoped<Backend.Auth.TokenService>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("ng");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
