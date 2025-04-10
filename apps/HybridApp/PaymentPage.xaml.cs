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
    }

    private async void NavigateBackToMainPage()
    {
        // Navigate back to MainPage
        await Navigation.PopAsync();
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
        CrossNFC.Current.StopListening();
    }
}
