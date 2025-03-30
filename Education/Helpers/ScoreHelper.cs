using System.Text.Json;
using System.Text.Json.Serialization;
using Education.Consts;
using Education.Models.Questions;

namespace Education.Helpers;

public static class ScoreHelper
{
    public static double GetScore(QuestionTypeEnum type, string answer, string userAnswer)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            NumberHandling = JsonNumberHandling.AllowReadingFromString
        };
        
        double result = 0;
        switch (type)
        {
            case QuestionTypeEnum.SingleChoice:
                var origSingleAnswer = JsonSerializer.Deserialize<SingleChoiceAnswerModel>(answer, options);
                if (userAnswer == origSingleAnswer!.CorrectAnswerId)
                {
                    result = 1;
                }
                return result;
            case QuestionTypeEnum.MultipleChoice:
                var origMultipleAnswer = JsonSerializer.Deserialize<MultipleAnswerModel>(answer, options);
                var userMultipleAnswer = JsonSerializer.Deserialize<List<string>>(userAnswer, options);
                foreach (var multOption in origMultipleAnswer!.Answers)
                {
                    var isIn = userMultipleAnswer!.Contains(multOption.Id);
                    if (isIn && multOption.Correct) result += multOption.Weight;
                    if (!isIn && !multOption.Correct) result += multOption.Weight;
                }
                return result;
            case QuestionTypeEnum.Match:
                var origMatchAnswer = JsonSerializer.Deserialize<MatchAnswerModel>(answer, options);
                var userMatchAnswer = JsonSerializer.Deserialize<List<MatchUserAnswerModel>>(userAnswer, options);
                foreach (var matchOption in origMatchAnswer!.Matches)
                {
                    var userMatch = userMatchAnswer!.FirstOrDefault(m => m.Left == matchOption.Left.Id);
                    if (userMatch is null) continue;
                    if (matchOption.Right.Id == userMatch.Right)
                    {
                        result += matchOption.Weight;
                    }
                }
                return result;
            case QuestionTypeEnum.ShortAnswer:
                var origShortAnswer = JsonSerializer.Deserialize<ShortAnswerModel>(answer, options);
                if (origShortAnswer!.Answer.Contains(userAnswer, StringComparison.InvariantCultureIgnoreCase))
                {
                    result = 1;
                }
                return result;
            default:
                return 0;
        }
    }
}