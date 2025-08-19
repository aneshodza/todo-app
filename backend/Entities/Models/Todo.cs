using Backend.Entities.Enums;
using Microsoft.AspNetCore.Identity;

namespace Backend.Entities.Models;

public class Todo
{
  public int Id { get; set; }
  public string Title { get; set; } = null!;
  public bool Done { get; set; } = false;
  public Priority Priority { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime? DueAt { get; set; } = null;

  public string OwnerId { get; set; } = null!;
  public IdentityUser Owner { get; set; } = null!;
}
