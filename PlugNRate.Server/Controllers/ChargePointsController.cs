using Microsoft.AspNetCore.Mvc;
using PlugNRate.Server.Services;
using System.Threading.Tasks;

namespace PlugNRate.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChargePointsController : ControllerBase
    {
        private readonly FetchOpenChargeMapService _openChargeMapService;

        public ChargePointsController(FetchOpenChargeMapService openChargeMapService)
        {
            _openChargeMapService = openChargeMapService;
        }

        [HttpGet]
        public async Task<IActionResult> GetChargePoints()
        {
            var chargePoints = await _openChargeMapService.GetChargePointsAsync();
            return Ok(chargePoints);
        }
    }

}
