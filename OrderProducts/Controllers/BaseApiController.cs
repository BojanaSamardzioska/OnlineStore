using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderProducts.Common;

namespace OrderProducts.Controllers;

[ApiController, Authorize]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    protected ActionResult HandleResult<T>(Result<T> result)
    {
        if (!result.IsSuccess) return BadRequest(result.Error);

        if (result.Data != null) return Ok(result.Data);

        return NoContent();
    }
}