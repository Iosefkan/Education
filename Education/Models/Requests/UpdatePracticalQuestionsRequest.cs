using System.ComponentModel.DataAnnotations;

namespace Education.Models.Requests;

public class UpdatePracticalQuestionsRequest
{
    [Required]
    public long PracticalId { get; set; }
    [Required]
    public List<long> QuestionIds { get; set; }
    [Required, Range(1, int.MaxValue)]
    public int TriesCount { get; set; }
}