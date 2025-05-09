using System.Text.Json.Serialization;
using Education.Consts;

namespace Education.Models.QuestionAnswers;

[JsonDerivedType(typeof(MatchAnswerBase), 0)]
[JsonDerivedType(typeof(MultipleAnswerBase), 1)]
[JsonDerivedType(typeof(ShortAnswerBase), 2)]
[JsonDerivedType(typeof(SingleAnswerBase), 3)]
public class AnswerBase
{
    public QuestionTypeEnum Type { get; set; }
    public string QuestionText { get; set; }
    public double QuestionWeight { get; set; }
    public double QuestionScore { get; set; }
    // TODO: remove when db is done
    public string Id { get; set; } = Guid.NewGuid().ToString();
}