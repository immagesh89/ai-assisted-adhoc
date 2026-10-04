namespace Api.Features.SavedItems;

public record SavedItem(string Id, string UserId, string ProductId, DateTimeOffset SavedAt);
