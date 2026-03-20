namespace backend.Models;

public class CheckoutRequest
{
    public List<CheckoutItem> Items { get; set; } = new();
}

public class CheckoutItem
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}
