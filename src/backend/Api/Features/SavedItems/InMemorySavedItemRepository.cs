namespace Api.Features.SavedItems;

// In-memory implementation for local development and Day 1 training.
// Keyed by userId to mirror a Cosmos DB partition key pattern as noted in requirements.
public class InMemorySavedItemRepository : ISavedItemRepository
{
    private readonly List<SavedItem> _savedItems = new();
    private readonly object _lock = new();

    public IReadOnlyList<SavedItem> GetSavedItemsByUserId(string userId)
    {
        lock (_lock)
        {
            return _savedItems
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.SavedAt)
                .ToList()
                .AsReadOnly();
        }
    }

    public SavedItem? GetSavedItem(string userId, string productId)
    {
        lock (_lock)
        {
            return _savedItems.FirstOrDefault(s => s.UserId == userId && s.ProductId == productId);
        }
    }

    public SavedItem SaveItem(string userId, string productId)
    {
        lock (_lock)
        {
            var existing = _savedItems.FirstOrDefault(s => s.UserId == userId && s.ProductId == productId);
            if (existing != null)
            {
                return existing;
            }

            // Check limit - user may not have more than 20 products saved at once
            var userSavedCount = _savedItems.Count(s => s.UserId == userId);
            if (userSavedCount >= 20)
            {
                throw new InvalidOperationException("User cannot save more than 20 items.");
            }

            var savedItem = new SavedItem(
                Id: Guid.NewGuid().ToString(),
                UserId: userId,
                ProductId: productId,
                SavedAt: DateTimeOffset.UtcNow);
            _savedItems.Add(savedItem);
            return savedItem;
        }
    }

    public void RemoveItem(string userId, string productId)
    {
        lock (_lock)
        {
            var item = _savedItems.FirstOrDefault(s => s.UserId == userId && s.ProductId == productId);
            if (item != null)
            {
                _savedItems.Remove(item);
            }
        }
    }
}
