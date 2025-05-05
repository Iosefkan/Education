using Education.Consts;
using Education.DAL;
using Education.DAL.Models;
using Education.Extensions;
using Education.Helpers;
using Education.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Education.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize(Roles = RoleConstants.Teacher)]
public class TeacherController(ApplicationContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetTaskFiles(long taskId)
    {
        var result = await context.CaseFiles
            .Include(cf => cf.User)
            .AsNoTracking()
            .Where(cf => cf.CaseId == taskId)
            .Select(cf => new { cf.Path, Name = cf.Path.GetPublicFileName(), cf.UserId, FullName = cf.User.GetFullName() })
            .ToListAsync();
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetStudents(long courseId)
    {
        var result = await context.Users
            .Include(u => u.Role)
            .Include(u => u.CourseBindUsers)
            .Where(u => u.Role.Name == RoleConstants.Student)
            .AsNoTracking()
            .Select(u => new
            {
                Value = u.Id,
                Label = u.GetFullName(),
                IsEnrolled = u.CourseBindUsers.Any(c => c.CourseId == courseId),
            })
            .ToListAsync();
        return Ok(result);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetQuestions(long moduleId)
    {
        var result = await context.Questions
            .Where(q => q.ModuleId == moduleId)
            .AsNoTracking()
            .Select(q => new
            {
                q.Id,
                q.Text,
                Type = q.QuestionTypeId,
                q.Weight,
                q.Answer
            })
            .OrderByDescending(q => q.Id)
            .ToListAsync();
        return Ok(result);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetMakePracticalQuestions(long moduleId, long practId)
    {
        var result = await context.Questions
            .Include(q => q.PracticalMaterialBindQuestions)
            .Where(q => q.ModuleId == moduleId)
            .AsNoTracking()
            .Select(q => new
            {
                q.Id,
                q.Text,
                Type = q.QuestionTypeId,
                Body = q.Options,
                IsSelected = q.PracticalMaterialBindQuestions.Any(q => q.PracticalMaterialId == practId)
            })
            .ToListAsync();
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetCourses()
    {
        var login = User?.Identity?.Name;
        if (login is null) return Unauthorized();
        var result = await context.Courses
            .Include(c => c.User)
            .Where(c => c.User.Login == login)
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

    [HttpPost]
    public async Task<IActionResult> CreateCourse([FromBody] AddCourseRequest request)
    {
        var login = User?.Identity?.Name;
        if (login is null) return Unauthorized();
        var user = await context.Users.FirstOrDefaultAsync(u => u.Login == login);
        if (user is null) return BadRequest();
        var course = new Course()
        {
            Name = request.Name,
            Description = request.Description,
            Date = request.Date.UtcDateTime,
            UserId = user.Id
        };
        await context.Courses.AddAsync(course);
        await context.SaveChangesAsync();
        return Ok(new
        {
            course.Id,
            course.Date,
            course.Description,
            course.Name,
        });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateCourseStudents([FromBody] UpdateCourseStudentsRequest request)
    {
        var curStudentsOnCourse = await context.Users
            .Include(u => u.Role)
            .Include(u => u.CourseBindUsers)
            .Where(u => u.Role.Name == RoleConstants.Student && u.CourseBindUsers.Any(c => c.CourseId == request.CourseId))
            .ToListAsync();

        foreach (var student in curStudentsOnCourse)
        {
            if (!request.UserIds.Contains(student.Id))
            {
                var courseBind = await context.CourseBindUsers.FirstOrDefaultAsync(c => c.CourseId == request.CourseId && c.UserId == student.Id);
                if (courseBind is not null)
                {
                    context.CourseBindUsers.Remove(courseBind);
                }
            }
            else
            {
                request.UserIds.Remove(student.Id);
            }
        }
        
        await context.SaveChangesAsync();


        var courseBinds = request.UserIds.Select(studId => new CourseBindUser()
        {
            CourseId = request.CourseId,
            UserId = studId
        }).ToList();

        await context.CourseBindUsers.AddRangeAsync(courseBinds);
        
        await context.SaveChangesAsync();
        
        return Ok();
    }

    [HttpPut]
    public async Task<IActionResult> UpdatePracticalMaterialQuestions(
        [FromBody] UpdatePracticalQuestionsRequest request)
    {
        var curTestQuestions = await context.PracticalMaterialBindQuestions
            .Where(u => u.PracticalMaterialId == request.PracticalId)
            .ToListAsync();

        foreach (var bind in curTestQuestions)
        {
            if (!request.QuestionIds.Contains(bind.QuestionId))
            {
                context.PracticalMaterialBindQuestions.Remove(bind);
            }
            else
            {
                request.QuestionIds.Remove(bind.QuestionId);
            }
        }
        
        await context.SaveChangesAsync();


        var questBinds = request.QuestionIds.Select(questId => new PracticalMaterialBindQuestion()
        {
            PracticalMaterialId = request.PracticalId,
            QuestionId = questId
        }).ToList();

        await context.PracticalMaterialBindQuestions.AddRangeAsync(questBinds);
        
        await context.SaveChangesAsync();
        
        return Ok();
    }

    [HttpPut]
    public async Task<IActionResult> UpdateQuestion([FromBody] UpdateQuestionRequest request)
    {
        var question = await context.Questions
            .FirstOrDefaultAsync(q => q.Id == request.QuestionId);

        if (question is null) return NotFound();
        question.Answer = request.Answer;
        question.Options = request.Body;
        question.Weight = request.Weight;
        question.Text = request.Text;
        await context.SaveChangesAsync();
        return Ok();
    }

    [HttpPut]
    public async Task<IActionResult> UpdateTheoryText([FromBody] UpdateTheoryTextRequest request)
    {
        var theory = await context.TheoreticalMaterials.FirstOrDefaultAsync(m => m.Id == request.TheoryId);
        if (theory is null) return BadRequest();
        theory.Text = request.Text;
        await context.SaveChangesAsync();
        return Ok();
    }

    [HttpPut]
    public async Task<IActionResult> UpdateTaskText([FromBody] UpdateTaskTextRequest request)
    {
        var task = await context.Cases.FirstOrDefaultAsync(c => c.Id == request.TaskId);
        if (task is null) return BadRequest();
        task.Text = request.Text;
        await context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> CreateModule([FromBody] AddModuleRequest request)
    {
        var module = new Module()
        {
            CourseId = request.CourseId,
            Name = request.Name
        };
        await context.Modules.AddAsync(module);
        await context.SaveChangesAsync();
        return Ok(new { module.Id, module.Name });
    }
    
    [HttpPost]
    public async Task<IActionResult> CreatePractical([FromBody] AddPracticalRequest request)
    {
        var practical = new PracticalMaterial()
        {
            ModuleId = request.ModuleId,
            Name = request.Name
        };
        await context.PracticalMaterials.AddAsync(practical);
        await context.SaveChangesAsync();
        return Ok(new { practical.Id, practical.Name });
    }

    [HttpPost]
    public async Task<IActionResult> CreateQuestion([FromBody] AddQuestionRequest request)
    {
        var question = new Question()
        {
            ModuleId = request.ModuleId,
            Answer = request.Answer,
            Options = request.Body,
            Weight = request.Weight,
            Text = request.Text,
            QuestionTypeId = (long)request.Type
        };
        await context.Questions.AddAsync(question);
        await context.SaveChangesAsync();
        return Ok(new
        {
            question.Id,
            question.Text,
            Type = question.QuestionTypeId,
            question.Weight,
            question.Answer
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateTest([FromBody] AddTestRequest request)
    {
        var practicalMaterial = await context.PracticalMaterials.FirstOrDefaultAsync(pm => pm.Id == request.PracticalId);
        if (practicalMaterial is null)
        {
            return BadRequest();
        }

        var binds = request.QuestionIds.Select(id => new PracticalMaterialBindQuestion()
        {
            PracticalMaterialId = practicalMaterial.Id,
            QuestionId = id
        });
        await context.PracticalMaterialBindQuestions.AddRangeAsync(binds);
        await context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> CreateTheory([FromBody] AddTheoryRequest request)
    {
        TheoreticalMaterial theory = new() { ModuleId = request.ModuleId, Name =  request.Name, Text = "Текст лекции" };
        await context.TheoreticalMaterials.AddAsync(theory);
        await context.SaveChangesAsync();
        return Ok(new { theory.Id, theory.Name });
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] AddTaskRequest request)
    {
        Case task = new() { PracticalMaterialId = request.PracticalId, Name = request.Name, Text = "Текст задания" };
        await context.Cases.AddAsync(task);
        await context.SaveChangesAsync();
        return Ok(new { task.Id, task.Name });
    }

    [HttpPost]
    public async Task<IActionResult> CreateTheoryDocument([FromForm] AddDocRequest request)
    {
        var fileName = await FileHelper.SaveFileToPublic(request.File);
        var file = new TheoreticalMaterialFile()
        {
            Path = fileName,
            Description = request.Descritpion,
            TheoreticalMaterialId = request.TheoryMaterialId
        };
        await context.TheoreticalMaterialFiles.AddAsync(file);
        await context.SaveChangesAsync();
        return Ok(new { file.Id, file.Description, file.Path, Name = file.Path.GetPublicFileName() });
    }

    [HttpPost]
    public async Task<IActionResult> CreateTheoryLink([FromBody] AddLinkRequest request)
    {
        var link = new TheoreticalMaterialLink()
        {
            Link = request.Link,
            Description = request.Description,
            TheoreticalMaterialId = request.TheoryMaterialId
        };
        await context.TheoreticalMaterialLinks.AddAsync(link);
        await context.SaveChangesAsync();
        return Ok(new { link.Id, link.Description, link.Link });
    }



    [HttpDelete]
    public async Task<IActionResult> DeleteCourse(long courseId)
    {
        await context.Courses.Where(c => c.Id == courseId).ExecuteDeleteAsync();
        return Ok();
    }
    
    [HttpDelete]
    public async Task<IActionResult> DeleteModule(long moduleId)
    {
        await context.Modules.Where(c => c.Id == moduleId).ExecuteDeleteAsync();
        return Ok();
    }
    
    [HttpDelete]
    public async Task<IActionResult> DeletePractical(long practicalId)
    {
        await context.PracticalMaterials.Where(c => c.Id == practicalId).ExecuteDeleteAsync();
        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteQuestion(long questionId)
    {
        await context.Questions.Where(q => q.Id == questionId).ExecuteDeleteAsync();
        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteTheoryMaterial(long theoryId)
    {
        await context.TheoreticalMaterials.Where(q => q.Id == theoryId).ExecuteDeleteAsync();
        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteTask(long taskId)
    {
        await context.Cases.Where(q => q.Id == taskId).ExecuteDeleteAsync();
        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteTheoryLink(long linkId)
    {
        await context.TheoreticalMaterialLinks.Where(q => q.Id == linkId).ExecuteDeleteAsync();
        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteTheoryDoc(long docId)
    {
        var theorFile = await context.TheoreticalMaterialFiles.FirstOrDefaultAsync(f => f.Id == docId);
        if (theorFile is null) return BadRequest();
        FileHelper.DeleteFileFromPublic(theorFile.Path);
        context.TheoreticalMaterialFiles.Remove(theorFile);
        await context.SaveChangesAsync();
        return Ok();
    }
}