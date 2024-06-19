namespace PlugNRate.Server.Services
{
    public class FetchOpenChargeMapService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public FetchOpenChargeMapService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _apiKey = Environment.GetEnvironmentVariable("OPENCHARGEMAP_API_KEY");
        }

        public async Task<string> GetChargePointsAsync()
        {
            var requestUrl = "https://api.openchargemap.io/v3/poi/?output=json&countrycode=SE&maxresults=500&key={_apiKey}";
            
            var response = await _httpClient.GetAsync(requestUrl);

            if(response.IsSuccessStatusCode) 
            {
                return await response.Content.ReadAsStringAsync();
            }

            throw new Exception("Error fetching data from Open Charge Map API");
        }
    }
}
