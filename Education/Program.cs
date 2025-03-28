using Education.DAL;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

/*builder.WebHost.ConfigureKestrel(cfg =>
{
    cfg.ListenAnyIP(8000);
});*/

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/login";
        options.AccessDeniedPath = "/accessdenied";
    });

builder.Services.AddAuthorization();

builder.Services.AddOpenApi();

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<ApplicationContext>(optionsAction => optionsAction.UseNpgsql(connectionString));

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.Run("http://localhost:8000");