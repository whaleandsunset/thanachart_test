using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;

    public CartController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("checkout")]
    public async Task<ActionResult<object>> Checkout([FromBody] CheckoutRequest request)
    {
        if (request.Items == null || !request.Items.Any())
            return BadRequest(new { message = "ไม่มีรายการสินค้า" });

        var productIds = request.Items.Select(i => i.ProductId).ToList();

        var products = await _context.Products
            .Include(p => p.Stock)
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync();

        foreach (var item in request.Items)
        {
            var product = products.FirstOrDefault(p => p.Id == item.ProductId);
            if (product == null)
                return BadRequest(new { message = $"ไม่พบสินค้า ID: {item.ProductId}" });

            if (product.Stock == null || product.Stock.Quantity < item.Quantity)
                return BadRequest(new { message = $"สินค้า '{product.Name}' มีสต็อกไม่เพียงพอ" });
        }

        decimal totalAmount = 0;
        var checkoutItems = new List<object>();

        foreach (var item in request.Items)
        {
            var product = products.First(p => p.Id == item.ProductId);
            product.Stock!.Quantity -= item.Quantity;
            decimal subtotal = product.Price * item.Quantity;
            totalAmount += subtotal;

            checkoutItems.Add(new
            {
                productId = product.Id,
                code = product.Code,
                name = product.Name,
                price = product.Price,
                quantity = item.Quantity,
                subtotal
            });
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "ชำระเงินสำเร็จ",
            items = checkoutItems,
            totalAmount
        });
    }
}
