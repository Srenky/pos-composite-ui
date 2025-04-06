using System.Web;

namespace HybridApp;

public partial class MainPage
{

    public MainPage()
    {
        InitializeComponent();
    }
    
    // Property to store reference to SecondPage
    private PaymentPage paymentPage;

    // Method to navigate to PaymentPage
    private async void NavigateToPaymentPage(int amountToPay)
    {
        paymentPage = new PaymentPage(amountToPay);
        await Navigation.PushAsync(paymentPage);
    }
    
    // When MainPage appears again, check payment status and send message to JS
    protected override void OnAppearing()
    {
        base.OnAppearing();

        if (paymentPage == null || string.IsNullOrEmpty(paymentPage.PaymentStatus)) return;
        
        // Send payment status to the WebView
        SendMessageToReactApp(paymentPage.PaymentStatus);
    }

    // Send message to JS app through WebView
    private async void SendMessageToReactApp(string status)
    {
        await CheckoutWebView.EvaluateJavaScriptAsync($"window.postMessage('fromMaui:{status}', 'https://thunderous-halva-561caf.netlify.app')");
    }
    
    // Handle navigation change in WebView (URL redirect etc.)
    // If URL contains keyword 'csharp' (e.g. http://csharp...) we intercept the redirect
    // and perform method specified in the URL with given parameters (if present)
    private void HandleNavigatingAsync(object sender, WebNavigatingEventArgs e)
    {
        // Parse the URL
        var uri = new Uri(e.Url);
        
        if (!uri.Host.Contains("csharp", StringComparison.CurrentCultureIgnoreCase)) return;
        
        // Get the query string parameters
        var query = uri.Query;

        // Use HttpUtility to parse the query string and get the value of 'amount'
        var queryParams = HttpUtility.ParseQueryString(query);
        var amount = queryParams["amount"];

        // prevent the navigation to complete
        e.Cancel = true;

        // Go to the 
        if (amount != null) NavigateToPaymentPage(int.Parse(amount));
    }
}