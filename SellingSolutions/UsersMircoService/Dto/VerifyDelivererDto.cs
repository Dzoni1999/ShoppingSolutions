using UsersMicroService.Models;

namespace UsersMicroService.Dto
{
    public class VerifyDelivererDto
    {
        public long Id { get; set; }
        public VerifiedStatus IsVerified { get; set; }
    }
}
