namespace Api.Features.SavedItems;

public static class SavedItemEndpoints
{
    public static void MapSavedItemEndpoints(this WebApplication app)
    {
        app.MapPost("/api/products/{productId}/save", (string productId, HttpContext context, ISavedItemRepository repo) =>
        {
            if (!context.Request.Headers.TryGetValue("X-User-Id", out var userIdHeader) || string.IsNullOrWhiteSpace(userIdHeader))
            {
                return Results.Unauthorized();
            }

            var userId = userIdHeader.ToString();
            var existing = repo.GetSavedItem(userId, productId);
            if (existing != null)
            {
                return Results.Ok(existing);
            }

            try
            {
                var savedItem = repo.SaveItem(userId, productId);
                return Results.Created($"/api/saved-items/{savedItem.Id}", savedItem);
            }
            catch (InvalidOperationException)
            {
                return Results.Conflict(new { message = "User cannot save more than 20 items." });
            }
        });

        app.MapDelete("/api/products/{productId}/save", (string productId, HttpContext context, ISavedItemRepository repo) =>
        {
            if (!context.Request.Headers.TryGetValue("X-User-Id", out var userIdHeader) || string.IsNullOrWhiteSpace(userIdHeader))
            {
                return Results.Unauthorized();
            }

            var userId = userIdHeader.ToString();
            repo.RemoveItem(userId, productId);
            return Results.NoContent();
        });

        app.MapGet("/api/saved-items", (HttpContext context, ISavedItemRepository repo) =>
        {
            if (!context.Request.Headers.TryGetValue("X-User-Id", out var userIdHeader) || string.IsNullOrWhiteSpace(userIdHeader))
            {
                return Results.Unauthorized();
            }

            var userId = userIdHeader.ToString();
            var savedItems = repo.GetSavedItemsByUserId(userId);
            return Results.Ok(savedItems);
        });
    }
}
