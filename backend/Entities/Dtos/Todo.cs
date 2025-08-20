using Backend.Entities.Enums;
using Backend.Entities.Models;

namespace Backend.Entities.Dtos;

public record TodoDto(
    int Id,
    string Title,
    bool Done,
    Priority Priority,
    DateTime? DueAt,
    DateTime CreatedAt,
    string OwnerId
    );
public record CreateTodoRequest(string Title, Priority Priority, DateTime? DueAt);
public record MarkTodosAsDoneRequest(int[] Ids);

public static class TodoMappings
{
  public static IQueryable<TodoDto> ProjectToDto(this IQueryable<Todo> q)
    => q.Select(t => new TodoDto(t.Id, t.Title, t.Done, t.Priority, t.DueAt, t.CreatedAt, t.OwnerId));

  public static TodoDto ToDto(this Todo todo)
    => new TodoDto(todo.Id, todo.Title, todo.Done, todo.Priority, todo.DueAt, todo.CreatedAt, todo.OwnerId);
}
