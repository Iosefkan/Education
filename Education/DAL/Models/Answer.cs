using System.ComponentModel.DataAnnotations.Schema;

namespace Education.DAL.Models;

public class Answer
{
    [Column("id")]
    public long Id { get; set; }
    [Column("answer", TypeName = "jsonb")]
    public string Answers { get; set; }
    [Column("is_correct")]
    public bool IsCorrect { get; set; }
    [Column("question_list_bind_question_id")]
    public long QuestionListBindQuestionId { get; set; }
    public PracticalMaterialBindQuestion PracticalMaterialBindQuestion { get; set; }
    [Column("user_id")]
    public long UserId { get; set; }
    public User User { get; set; }
}