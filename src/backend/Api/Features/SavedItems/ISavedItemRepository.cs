namespace Api.Features.SavedItems;

public interface ISavedItemRepository
{
    IReadOnlyList<SavedItem> GetSavedItemsByUserId(string userId);
    SavedItem? GetSavedItem(string userId, string productId);
    SavedItem SaveItem(string userId, string productId);
    void RemoveItem(string userId, string productId);
}
