using System.Net;
using System.Net.Http.Json;
using Api.Features.SavedItems;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Api.Tests.Features.SavedItems;

public class SavedItemEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public SavedItemEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task PostSave_MissingHeader_ReturnsUnauthorized()
    {
        var response = await _client.PostAsync("/api/products/prod-001/save", null);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task PostSave_FirstTime_ReturnsCreated()
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/products/prod-001/save");
        request.Headers.Add("X-User-Id", "user-test-1");
        var response = await _client.SendAsync(request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task PostSave_Repeat_ReturnsOk()
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/products/prod-001/save");
        request.Headers.Add("X-User-Id", "user-test-2");
        var response1 = await _client.SendAsync(request);
        var response2 = await _client.SendAsync(request);
        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);
        Assert.Equal(HttpStatusCode.OK, response2.StatusCode);
    }

    [Fact]
    public async Task DeleteSave_NotSaved_ReturnsNoContent()
    {
        var request = new HttpRequestMessage(HttpMethod.Delete, "/api/products/prod-999/save");
        request.Headers.Add("X-User-Id", "user-test-3");
        var response = await _client.SendAsync(request);
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task GetSavedItems_ReturnsOk()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/saved-items");
        request.Headers.Add("X-User-Id", "user-test-4");
        var response = await _client.SendAsync(request);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
