using System;
using System.Collections.Generic;
using System.Runtime.ExceptionServices;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Contoso.HttpHost.Middleware.Exception
{
    public class ExceptionHandler
    {
        private readonly RequestDelegate _next;

        public ExceptionHandler(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (System.Exception ex)
            {
                if (context.Response.StatusCode == 500)
                {
                    await ProcessExceptionAsync(context, ex);
                }
                else
                {
                    await _next(context);
                }
            }
        }

        private static Task ProcessExceptionAsync(HttpContext context, System.Exception ex)
        {
            var exceptionInfo = JsonSerializer.Serialize(new { excpetion = ex.Message, ex.StackTrace });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 500;

            return context.Response.WriteAsync(exceptionInfo);
        }


    }
}
