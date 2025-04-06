using Plugin.NFC;

namespace HybridApp;

public partial class PaymentPage
{
    public string PaymentStatus { get; private set; }
    
    public PaymentPage(int amountToPay)
    {
        InitializeComponent();
        AmountLabel.Text = "Amount to pay: " + amountToPay;
        
        // Subscribe to NFC events when this page is loaded
        SubscribeToNfcEvents();
    }
    
    private void SubscribeToNfcEvents()
    {
        // Check if NFC is available and enabled
        if (!CrossNFC.IsSupported || !CrossNFC.Current.IsAvailable) return;
        
        CrossNFC.Current.OnMessageReceived += OnNFCMessageReceived;
        // CrossNFC.Current.OnTagDiscovered += OnNFCTagDiscovered;
            
        // Start listening for NFC tags
        CrossNFC.Current.StartListening();
    }

    // This handler is triggered when an NFC tag sends an NDEF message
    private async void OnNFCMessageReceived(ITagInfo tagInfo)
    {
        // Simulate payment processing by delaying for 3-5 seconds, then go back to MainPage with WebView
        Status.Text = "Processing payment...";
        await Task.Delay(3000);
        Status.Text = "Payment successful";
        PaymentStatus = "Successful";
        NavigateBackToMainPage();
        
        // if (tagInfo == null)
        // {
        //     await DisplayAlert("NFC", "No NFC tag found.", "OK");
        //     return;
        // }
        //
        // // Check if the tag contains an NDEF message
        // if (tagInfo.Records is { Length: > 0 })
        // {
        //     // Loop through the records in the NDEF message (if any)
        //     foreach (var record in tagInfo.Records)
        //     {
        //         string tagData = record.Message;
        //         // Optionally: Process the tag data (e.g., log or display it)
        //         Console.WriteLine($"NFC Tag Data: {tagData}");
        //     }
        //
        //     // Show success message
        //     await DisplayAlert("Payment", "Payment has been made successfully", "OK");
        //
        //     // Navigate back to MainPage
        //     await Navigation.PopAsync();
        // }
        // else
        // {
        //     // If not NDEF, handle as raw NFC tag (see next handler)
        //     await DisplayAlert("NFC", "NDEF is not supported on this tag.", "OK");
        // }
    }

    // This handler is triggered when a raw NFC tag (without NDEF) is discovered
    // private async void OnNFCTagDiscovered(ITagInfo tagInfo, bool isNdef)
    // {
    //     await DisplayAlert("NFC", "OnNFCTagDiscovered", "OK");
    //     
    //     if (tagInfo == null)
    //     {
    //         await DisplayAlert("NFC", "No NFC tag detected.", "OK");
    //         return;
    //     }
    //
    //     // Handle the raw tag detection, regardless of whether it contains an NDEF message
    //     if (isNdef)
    //     {
    //         await DisplayAlert("NFC", "NDEF tag detected but no message found.", "OK");
    //     }
    //     else
    //     {
    //         // For raw NFC tags, just show success and return to MainPage
    //         await DisplayAlert("Payment", "Payment has been made successfully (Raw Tag)", "OK");
    //         await Navigation.PopAsync();
    //     }
    // }
    
    private async void NavigateBackToMainPage()
    {
        await Navigation.PopAsync();  // Navigate back to MainPage
    }

    // Unsubscribe from NFC events when this page is being disposed
    protected override void OnDisappearing()
    {
        base.OnDisappearing();
        UnsubscribeFromNfcEvents();
    }

    private void UnsubscribeFromNfcEvents()
    {
        CrossNFC.Current.OnMessageReceived -= OnNFCMessageReceived;
        // CrossNFC.Current.OnTagDiscovered -= OnNFCTagDiscovered;
        CrossNFC.Current.StopListening();
    }
}