#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["Contoso.Retail.NextGen.PurchaseHistory.Host/Contoso.Retail.NextGen.PurchaseHistory.Host.csproj", "Contoso.Retail.NextGen.PurchaseHistory.Host/"]
COPY ["Contoso.Retail.NextGen.PurchaseHistory/Contoso.Retail.NextGen.PurchaseHistory.csproj", "Contoso.Retail.NextGen.PurchaseHistory/"]
COPY ["Contoso.HttpHost.Middleware.Exception/Contoso.HttpHost.Middleware.Exception.csproj", "Contoso.HttpHost.Middleware.Exception/"]
RUN dotnet restore "Contoso.Retail.NextGen.PurchaseHistory.Host/Contoso.Retail.NextGen.PurchaseHistory.Host.csproj"
COPY . .
WORKDIR "/src/Contoso.Retail.NextGen.PurchaseHistory.Host"
RUN dotnet build "Contoso.Retail.NextGen.PurchaseHistory.Host.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Contoso.Retail.NextGen.PurchaseHistory.Host.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Contoso.Retail.NextGen.PurchaseHistory.Host.dll"]