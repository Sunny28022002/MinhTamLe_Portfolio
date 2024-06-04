using ChatService;
using ChatService.Hubs;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddSignalR();
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
builder.Services.AddSingleton<IDictionary<string, UserConnection>>(opts => new Dictionary<string, UserConnection>());
var app = builder.Build();
app.MapGet("/", () => "Hello World!");

app.MapHub<chatHub>("/chat");

app.UseCors(MyAllowSpecificOrigins);

app.Run();
