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
        if (testResult is null) return NotFound();
        var isCompleted = testResult.IsCompleted;
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
                .AsNoTracking()
                .Where(a => a.TestResultId == testResult.Id)
                .ToListAsync();
        
        var answers = answersDb
            .Select(a => JsonSerializer.Deserialize<AnswerBase>(a.Answers, options)).ToList();
            
        return Ok(new { Answers = answers, IsCompleted = isCompleted, testResult.Score, testResult.MaxScore });
    }

    [HttpGet]
    public async Task<IActionResult> GetTestStatus(long practicalId)
    {
        var login = User?.Identity?.Name;
        if (login is null) return Unauthorized();
        var userId = await context.Users.Where(u => u.Login == login).Select(u => u.Id).FirstOrDefaultAsync();
        
        var testRes = await context.TestResults.AsNoTracking().FirstOrDefaultAsync(tr => tr.PracticalMaterialId == practicalId && tr.UserId == userId && !tr.IsCompleted);
        if (testRes is not null) return Ok(new { IsStarted = true });
        return Ok(new { IsStarted = false });
    }
    
    [HttpPut]
    public async Task<IActionResult> StartTest(long practicalId)
    {
        var login = User?.Identity?.Name;
        if (login is null) return Unauthorized();
        var userId = await context.Users.Where(u => u.Login == login).Select(u => u.Id).FirstOrDefaultAsync();
        
        var testRes = await context.TestResults.FirstOrDefaultAsync(tr => tr.PracticalMaterialId == practicalId && tr.UserId == userId && !tr.IsCompleted);
        if (testRes is null)
        {
            testRes = new TestResult { UserId = userId, PracticalMaterialId = practicalId, IsCompleted = false };
            await context.TestResults.AddAsync(testRes);
            await context.SaveChangesAsync();
        }

        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> UploadTest([FromBody] CheckTestResultRequest request)
    {
        var login = User?.Identity?.Name;
        if (login is null) return Unauthorized();
        var userId = await context.Users.Where(u => u.Login == login).Select(u => u.Id).FirstOrDefaultAsync();
        var testResult = await context.TestResults.FirstOrDefaultAsync(tr => tr.PracticalMaterialId == request.PracticalId && tr.UserId == userId && !tr.IsCompleted);
        if (testResult is null) return BadRequest();
        
        testResult.IsCompleted = true;
        testResult.TurnedDate = DateTime.UtcNow;
        
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
            .OrderByDescending(cfc => cfc.Id)
            .Select(cfc => new {cfc.Id, cfc.Created, cfc.Text})
            .ToListAsync();
        
        return Ok(new { taskFile.Path, taskFile.Id, Name = taskFile.Path.GetPublicFileName(), Comments = comments, taskFile.IsAccepted });
    }

    [HttpPut]
    public async Task<IActionResult> UploadTaskFile([FromForm] AddTaskFileRequest request)
    {
        // only one file per user
        var login = User?.Identity?.Name;
        if (login is null) return Unauthorized();
        var userId = await context.Users.Where(u => u.Login == login).Select(u => u.Id).FirstOrDefaultAsync();
        var taskFile = await context.CaseFiles
            .FirstOrDefaultAsync(cf => cf.UserId == userId && cf.CaseId == request.TaskId);
        
        if (taskFile is not null && taskFile.IsAccepted) return BadRequest();
        
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
        
        return Ok(new { taskFile.Id, taskFile.Path, Name = taskFile.Path.GetPublicFileName(), taskFile.IsAccepted });
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
    
    
    [HttpGet]
    public async Task<IActionResult> GetTasks(long practicalId)
    {
        var login = User?.Identity?.Name;
        if (login is null) return Unauthorized();
        var userId = await context.Users.Where(u => u.Login == login).Select(u => u.Id).FirstOrDefaultAsync();
        
        var result = await context.Cases
            .Include(c => c.CaseFiles)
            .AsNoTracking()
            .Where(c => c.PracticalMaterialId == practicalId)
            .Select(c => new { c.Id, c.Name, c.Text, IsAccepted = c.CaseFiles.Any(cf => cf.UserId == userId && cf.IsAccepted)})
            .ToListAsync();
        return Ok(result);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetTheories(long moduleId)
    {
        var cannotAccess = await context.PracticalMaterials
            .AsNoTracking()
            .Include(pm => pm.TestResults)
            .AnyAsync(tm => tm.TestResults.Any(tr => !tr.IsCompleted));
        if (cannotAccess) return Ok(new { CannotAccess = cannotAccess });
            
        var result = await context.TheoreticalMaterials
            .AsNoTracking()
            .Where(m => m.ModuleId == moduleId)
            .Select(m => new { m.Id, m.Name })
            .ToListAsync();
        
        return Ok(new { Theories = result, CannotAccess = cannotAccess });
    }
}