using Education.Consts;
using Education.DAL;
using Education.DAL.Models;
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
                Label = $"{u.LastName} {u.FirstName} {u.MiddleName}",
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
                Body = q.Options
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
            .Where(u => u.Role.Name == RoleConstants.Student)
            .Where(u => u.CourseBindUsers.Any(c => c.CourseId == request.CourseId))
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
            Body = question.Options
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
}