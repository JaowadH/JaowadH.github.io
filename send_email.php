<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitize and validate input
    $name = htmlspecialchars(trim($_POST['name']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(trim($_POST['message']));

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email format");
    }

    // Email configuration
    $to = "jaowad69@gmail.com";
    $subject = "New Contact Form Message from Portfolio";
    
    $email_body = "You have received a new message from your website contact form:\n\n".
                  "Name: $name\n".
                  "Email: $email\n".
                  "Message:\n$message\n";

    $headers = "From: noreply@yourdomain.com\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Send email
    if (mail($to, $subject, $email_body, $headers)) {
        // Success, redirect back with confirmation
        header('Location: index.html?sent=true#contact');
        exit;
    } else {
        echo "Failed to send email. Please try again later.";
    }
}
?>
