using Education.Consts;
using Education.DAL;
using Education.Helpers;
using Education.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Education.Controllers;

[ApiController]
[Authorize(Roles = RoleConstants.Student)]
[Route("api/[controller]/[action]")]
public class StudentController(ApplicationContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetCourses()
    {
        var login = User?.Identity?.Name;
        if (login is null) return Unauthorized();
        var userId = await context.Users.Where(u => u.Login == login).Select(u => u.Id).FirstOrDefaultAsync();
        var result = await context.Courses
            .Include(c => c.CourseBindUsers)
            .Where(c => c.CourseBindUsers.Any(uc => uc.UserId == userId))
            .AsNoTracking()
            .Select(c => new
            {
                c.Id,
                c.Date,
                c.Description,
                c.Name,
            })
            .ToListAsync();
        return Ok(result);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetModules(long courseId)
    {
        var result = await context.Modules
            .AsNoTracking()
            .Where(m => m.CourseId == courseId)
            .Select(m => new { m.Id, m.Name })
            .ToListAsync();
        return Ok(result);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetPracticals(long moduleId)
    {
        var result = await context.PracticalMaterials
            .AsNoTracking()
            .Where(m => m.ModuleId == moduleId)
            .Select(m => new { m.Id, m.Name })
            .ToListAsync();
        return Ok(result);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetPracticalQuestions(long practId)
    {
        var result = await context.Questions
            .Include(q => q.PracticalMaterialBindQuestions)
            .Where(q => q.PracticalMaterialBindQuestions.Any(pq => pq.PracticalMaterialId == practId))
            .AsNoTracking()
            .Select(q => new
            {
                q.Id,
                q.Text,
                Type = q.QuestionTypeId,
                Body = q.Options
            })
            .ToListAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> TestResult([FromBody] CheckTestResultRequest request)
    {
        double maxScore = 0;
        double score = 0;
        foreach (var ans in request.Answers)
        {
            var question = await context.Questions.FindAsync(ans.Id);
            if (question is null) continue;
            maxScore += question.Weight;
            score += question.Weight * ScoreHelper.GetScore((QuestionTypeEnum)question.QuestionTypeId, question.Answer, ans.Answer);
        }

        int grade = (score / maxScore) switch
        {
            >= 0.9 => 5,
            >= 0.75 and < 0.9 => 4,
            >= 0.6 and < 0.75 => 3,
            _ => 2,
        };
        
        return Ok(new
        {
            Score = $"{score:F}/{maxScore:F}",
            Percent = (score / maxScore * 100).ToString("F") + "%",
            Grade = grade
        });
    }
}