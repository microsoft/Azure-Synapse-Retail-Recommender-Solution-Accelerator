#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["Contoso.Retail.NextGen.RecommendationByUser.Host/Contoso.Retail.NextGen.RecommendationByUser.Host.csproj", "Contoso.Retail.NextGen.RecommendationByUser.Host/"]
COPY ["Contoso.Retail.NextGen.RecommendationByUser/Contoso.Retail.NextGen.RecommendationByUser.csproj", "Contoso.Retail.NextGen.RecommendationByUser/"]
COPY ["Contoso.HttpHost.Middleware.Exception/Contoso.HttpHost.Middleware.Exception.csproj", "Contoso.HttpHost.Middleware.Exception/"]
RUN dotnet restore "Contoso.Retail.NextGen.RecommendationByUser.Host/Contoso.Retail.NextGen.RecommendationByUser.Host.csproj"
COPY . .
WORKDIR "/src/Contoso.Retail.NextGen.RecommendationByUser.Host"
RUN dotnet build "Contoso.Retail.NextGen.RecommendationByUser.Host.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Contoso.Retail.NextGen.RecommendationByUser.Host.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Contoso.Retail.NextGen.RecommendationByUser.Host.dll"]