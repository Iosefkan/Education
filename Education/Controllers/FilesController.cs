﻿using Education.Consts;
using Education.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using System.IO;

namespace Education.Controllers;

[ApiController]
[Authorize(Roles = RoleConstants.All)]
public class FilesController : ControllerBase
{
    [Route("Files/{fileName}")]
    [HttpGet]
    public async Task<IActionResult> GetFile(string fileName)
    {
        var memory = new MemoryStream();
        var file = Path.Combine("Files", fileName);
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), file);
        using (var stream = new FileStream(filePath, FileMode.Open))
        {
            await stream.CopyToAsync(memory);
        }
        memory.Position = 0;
        var ext = Path.GetExtension(filePath).ToLowerInvariant();
        return File(memory, "application/octet-stream", file.GetPublicFileName());
    }
}
