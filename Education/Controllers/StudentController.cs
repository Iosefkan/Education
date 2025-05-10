using System.Diagnostics;
using System.Text.Json;
using Education.Consts;
using Education.DAL;
using Education.DAL.Models;
using Education.Extensions;
using Education.Helpers;
using Education.Models.QuestionAnswers;
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
    public async Task<IActionResult> GetPracticalQuestions(long practId)
    {
        var login = User?.Identity?.Name;
        if (login is null) return Unauthorized();
        var userId = await context.Users.Where(u => u.Login == login).Select(u => u.Id).FirstOrDefaultAsync();
        
        var testResult = await context.TestResults.Where(tr => tr.UserId == userId && tr.PracticalMaterialId == practId).FirstOrDefaultAsync();
        var isCompleted = testResult is not null;
        if (!isCompleted)
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
                .OrderByDescending(q => q.Id)
                .ToListAsync();
            
            return Ok(new { Questions = result, IsCompleted = isCompleted });
        }

        JsonSerializerOptions options = new() { AllowOutOfOrderMetadataProperties = true };
        var answersDb = await context.Answers
                .Where(a => a.TestResultId == testResult.Id)
                .ToListAsync();
        
        var answers = answersDb
            .Select(a => JsonSerializer.Deserialize<AnswerBase>(a.Answers, options)).ToList();
            
        return Ok(new { Answers = answers, IsCompleted = isCompleted, testResult.Score, testResult.MaxScore });
    }

    [HttpPost]
    public async Task<IActionResult> UploadTest([FromBody] CheckTestResultRequest request)
    {
        var login = User?.Identity?.Name;
        if (login is null) return Unauthorized();
        var userId = await context.Users.Where(u => u.Login == login).Select(u => u.Id).FirstOrDefaultAsync();
        
        var testResult = new TestResult
        {
            PracticalMaterialId = request.PracticalId,
            UserId = userId
        };
        
        List<AnswerBase> answers = new();
        foreach (var ans in request.Answers)
        {
            var question = await context.Questions.FindAsync(ans.Id);
            var bindId = (await context.PracticalMaterialBindQuestions.FirstAsync(b => b.PracticalMaterialId == request.PracticalId && b.QuestionId == ans.Id)).Id;
            if (question is null) continue;
            testResult.MaxScore += question.Weight;
            var result = ScoreHelper.GetAnswer((QuestionTypeEnum)question.QuestionTypeId, question, ans.Answer);
            answers.Add(result);
            testResult.Score += result.QuestionScore;
            testResult.Answers.Add(new Answer
            {
                PracticalMaterialBindQuestionId = bindId,
                Answers = JsonSerializer.Serialize(result)
            });
        }

        await context.TestResults.AddAsync(testResult);
        await context.SaveChangesAsync();

        
        return Ok(new
        {
            testResult.Score,
            testResult.MaxScore,
            Answers = answers,
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetTaskFile(long taskId)
    {
        var login = User?.Identity?.Name;
        if (login is null) return Unauthorized();
        var userId = await context.Users.Where(u => u.Login == login).Select(u => u.Id).FirstOrDefaultAsync();
        var taskFile = await context.CaseFiles
            .AsNoTracking()
            .FirstOrDefaultAsync(cf => cf.UserId == userId && cf.CaseId == taskId);
        if (taskFile is null) return NotFound();
        
        var comments = await context.CaseFileComments
            .AsNoTracking()
            .Where(cfc => cfc.CaseFileId == taskFile.Id && !cfc.IsGenerated)
            .Select(cfc => new {cfc.Id, cfc.Created, cfc.Text})
            .ToListAsync();
        
        return Ok(new { taskFile.Path, taskFile.Id, Name = taskFile.Path.GetPublicFileName(), Comments = comments });
    }

    [HttpPut]
    public async Task<IActionResult> UploadTaskFile([FromForm] AddTaskFileRequest request)
    {
        // only one file per user
        var login = User?.Identity?.Name;
        if (login is null) return Unauthorized();
        var userId = await context.Users.Where(u => u.Login == login).Select(u => u.Id).FirstOrDefaultAsync();
        var taskFile = await context.CaseFiles
            .AsNoTracking()
            .FirstOrDefaultAsync(cf => cf.UserId == userId && cf.CaseId == request.TaskId);

        string comment;
        if (taskFile is not null)
        {
            FileHelper.DeleteFileFromPublic(taskFile.Path);
            var filePath = await FileHelper.SaveFileToPublic(request.File);
            taskFile.Path = filePath;
            comment = "Файл обновлен";
        }
        else
        {
            var filePath = await FileHelper.SaveFileToPublic(request.File);
            taskFile = new CaseFile() { CaseId = request.TaskId, UserId = userId, Path = filePath };
            await context.CaseFiles.AddAsync(taskFile);
            comment = "Файл добавлен";
        }
        
        await context.SaveChangesAsync();
        
        CaseFileComment taskFileComment = new()
        {
            IsGenerated = true,
            Text = comment,
            CaseFileId = taskFile.Id,
        };
        await context.CaseFileComments.AddAsync(taskFileComment);
        await context.SaveChangesAsync();
        
        return Ok(new { taskFile.Id, taskFile.Path, Name = taskFile.Path.GetPublicFileName() });
    }
    
    [HttpGet]
    public async Task<IActionResult> GetPracticals(long moduleId)
    {
        var result = await context.PracticalMaterials
            .AsNoTracking()
            .Where(m => m.ModuleId == moduleId && m.IsPublic)
            .Select(m => new { m.Id, m.Name })
            .ToListAsync();
        return Ok(result);
    }
}