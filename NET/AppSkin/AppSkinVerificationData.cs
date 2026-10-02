namespace Componyx.UI
{
    internal class AppSkinVerificationData
    {
        /// <summary>
        /// Gets or sets the attempts made to verify the code.
        /// </summary>
        public int Attempts { get; set; }
        /// <summary>
        /// Gets or sets the verificationc code.
        /// </summary>
        public string VerificationCode { get; set; }
    }
}