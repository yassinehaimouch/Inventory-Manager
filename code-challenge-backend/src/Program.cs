using Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args: args);

var services = builder.Services;

services.AddDbContextPool<AppDbContext>(optionsAction: (provider, config) =>
{
    config.UseSqlite(
            connectionString: builder.Configuration.GetConnectionString("DefaultConnection"),
            databaseOptionsAction =>
            {
                databaseOptionsAction.CommandTimeout(commandTimeout: 30);
            })
        .EnableSensitiveDataLogging(true)
        .EnableDetailedErrors(true)
        .EnableThreadSafetyChecks(true)
        .EnableServiceProviderCaching(true);
});

services.AddCors(setupAction: config =>
{
    config.AddDefaultPolicy(configurePolicy: policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers(configure: option =>
option.SuppressAsyncSuffixInActionNames = false);

services.AddEndpointsApiExplorer();
services.AddSwaggerGen();

var app = builder.Build();

app
    .UseHttpsRedirection()
    .UseRouting()
    .UseCors()
    .UseSwagger()
    .UseSwaggerUI(setupAction: options =>
    {
        options.SwaggerEndpoint(
            url: "/swagger/v1/swagger.json",
            name: "v1");
        options.RoutePrefix = string.Empty;
        options.DefaultModelsExpandDepth(depth: -1);
    });

app.MapControllers();

app.Run();