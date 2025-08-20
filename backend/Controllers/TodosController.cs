using Backend.Data;
using Backend.Entities.Dtos;
using Backend.Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly UserManager<IdentityUser> _users;

  public TodosController(AppDbContext context, UserManager<IdentityUser> users)
  {
    _context = context;
    _users = users;
  }

  [HttpGet]
  public async Task<IActionResult> Index()
  {
    var user = await _users.GetUserAsync(User);

    if (user is null) return Unauthorized();

    var todos = await _context
      .Todos
      .Where(t => t.OwnerId == user.Id)
      .ProjectToDto()
      .ToListAsync();

    return Ok(todos);
  }

  [HttpPost]
  [Route("create")]
  public async Task<IActionResult> Create([FromBody] CreateTodoRequest req)
  {
    var user = await _users.GetUserAsync(User);

    if (user is null) return Unauthorized();

    var todo = new Todo
    {
      Title = req.Title,
      Priority = req.Priority,
      DueAt = req.DueAt,
      OwnerId = user.Id
    };
    await _context.Todos.AddAsync(todo);
    var createdCount = await _context.SaveChangesAsync();

    if (createdCount == 0) return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Could not create" });

    return CreatedAtAction(nameof(Index), new {}, todo.ToDto());
  }

  [HttpPatch]
  [Route("toggle")]
  public async Task<IActionResult> ToggleTodos([FromBody] MarkTodosAsDoneRequest req)
  {
    var user = await _users.GetUserAsync(User);

    if (user is null) return Unauthorized();

    var todos = await _context.Todos
      .Where(t => req.Ids.Contains(t.Id))
      .Where(t => t.OwnerId == user.Id)
      .ExecuteUpdateAsync(s => s.SetProperty(t => t.Done, t => !t.Done));

    await _context.SaveChangesAsync();

    return Ok();
  }
}
