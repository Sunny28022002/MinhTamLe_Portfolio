FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY MovieServices.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish MovieServices.csproj -c release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT [ "dotnet", "MovieServices.dll" ]