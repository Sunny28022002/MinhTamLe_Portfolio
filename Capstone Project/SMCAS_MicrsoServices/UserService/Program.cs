using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using UserService;
using UserService.Hubs;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.AddHttpContextAccessor();
builder.Services.AddSignalR();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});
builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateAudience = false,
        ValidateIssuer = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration.GetSection("AppSetting:Token").Value!))
    };
});
builder.Services.AddSingleton<IDictionary<string, UserConnection>>(opts => new Dictionary<string, UserConnection>());

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000") // Remove trailing slash from the origin URL
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials();
                      });
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("FeedBackFullAccess", policy =>
    {
        policy.RequireClaim("FeedBack", "Full Access");
    });
    options.AddPolicy("FeedBackCreateOrFullAccess", policy =>
    {
        policy.RequireClaim("FeedBack", "Full Access", "Create");
    });
    options.AddPolicy("FeedBackView,CreateOrFullAccess", policy =>
    {
        policy.RequireClaim("FeedBack", "View", "Create", "Full Access");
    });

    options.AddPolicy("UserFullAccess", policy =>
    {
        policy.RequireClaim("User", "Full Access");
    });
    options.AddPolicy("UserUpdateOrFullAccess", policy =>
    {
        policy.RequireClaim("User", "Full Access", "Update", "ViewAndUpdate");
    });
    options.AddPolicy("UserViewOrFullAccess", policy =>
    {
        policy.RequireClaim("User", "ViewAndUpdate", "Full Access");
    });
});
builder.Services.AddSingleton<IDictionary<string, UserConnection>>(opts => new Dictionary<string, UserConnection>());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();
app.MapGet("/", () => "Hello World!");
app.MapHub<ChatHub>("/chat");

//app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
