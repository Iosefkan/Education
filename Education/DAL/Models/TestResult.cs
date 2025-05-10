using System.ComponentModel.DataAnnotations.Schema;

namespace Education.DAL.Models;

public class TestResult
{
    [Column("id")]
    public long Id { get; set; }
    [Column("turned_in_date")]
    public DateTime TurnedInDate { get; set; } = DateTime.UtcNow;
    [Column("score")]
    public double Score { get; set; }
    [Column("max_score")]
    public double MaxScore { get; set; }
    [Column("user_id")]
    public long UserId { get; set; }
    public User User { get; set; }
    [Column("practical_material_id")]
    public long PracticalMaterialId { get; set; }
    public PracticalMaterial PracticalMaterial { get; set; }
    
    public List<Answer> Answers { get; set; } = new List<Answer>();
}