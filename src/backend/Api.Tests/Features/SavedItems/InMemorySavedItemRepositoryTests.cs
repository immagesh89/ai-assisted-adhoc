using Api.Features.SavedItems;
using Xunit;

namespace Api.Tests.Features.SavedItems;

public class InMemorySavedItemRepositoryTests
{
    [Fact]
    public void SaveItem_Idempotent_SameItemReturned()
    {
        var repo = new InMemorySavedItemRepository();
        var first = repo.SaveItem("user1", "prod-001");
        var second = repo.SaveItem("user1", "prod-001");
        Assert.Equal(first.Id, second.Id);
        Assert.Equal(first.ProductId, second.ProductId);
    }

    [Fact]
    public void RemoveItem_NotExists_NoError()
    {
        var repo = new InMemorySavedItemRepository();
        repo.RemoveItem("user1", "prod-001");
    }

    [Fact]
    public void GetSavedItemsByUserId_ReturnsMostRecentFirst()
    {
        var repo = new InMemorySavedItemRepository();
        repo.SaveItem("user1", "prod-001");
        repo.SaveItem("user1", "prod-002");
        var items = repo.GetSavedItemsByUserId("user1");
        Assert.Equal(2, items.Count);
    }

    [Fact]
    public void SaveItem_Exceeds20_Throws()
    {
        var repo = new InMemorySavedItemRepository();
        for (int i = 0; i < 20; i++)
        {
            repo.SaveItem("user1", $"prod-{i:D3}");
        }
        Assert.Throws<InvalidOperationException>(() => repo.SaveItem("user1", "prod-020"));
    }
}
