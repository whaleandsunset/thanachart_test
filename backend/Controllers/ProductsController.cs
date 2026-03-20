using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetProducts()
    {
        var products = await _context.Products
            .Include(p => p.Stock)
            .OrderBy(p => p.Code)
            .Select(p => new
            {
                p.Id,
                p.Code,
                p.Name,
                p.Price,
                stock = p.Stock == null ? 0 : p.Stock.Quantity
            })
            .ToListAsync();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Stock)
            .Where(p => p.Id == id)
            .Select(p => new
            {
                p.Id,
                p.Code,
                p.Name,
                p.Price,
                stock = p.Stock == null ? 0 : p.Stock.Quantity
            })
            .FirstOrDefaultAsync();

        if (product == null) return NotFound();
        return Ok(product);
    }
}
