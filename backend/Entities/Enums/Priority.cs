using System.Text.Json.Serialization;

namespace Backend.Entities.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Priority
{
  Low,
  Medium,
  High
}
