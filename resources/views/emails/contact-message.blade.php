<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <title>TrendPulse Contact Message</title>
</head>

<body style="margin: 0; padding: 0; background: #f5f5f5; font-family: Arial, sans-serif;">

    <div style="max-width: 650px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden;">

        <div style="background: #0A599E; padding: 30px; color: white;">
            <h1 style="margin: 0;">
                TrendPulse
            </h1>

            <p style="margin: 8px 0 0;">
                New Contact Message
            </p>
        </div>

        <div style="padding: 30px;">

            <h2 style="margin-top: 0;">
                {{ $contactSubject }}
            </h2>

            <table style="width: 100%; border-collapse: collapse;">

                <tr>
                    <td style="padding: 10px 0; font-weight: bold;">
                        Name
                    </td>

                    <td style="padding: 10px 0;">
                        {{ $name }}
                    </td>
                </tr>

                <tr>
                    <td style="padding: 10px 0; font-weight: bold;">
                        Email
                    </td>

                    <td style="padding: 10px 0;">
                        {{ $email }}
                    </td>
                </tr>

            </table>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">

            <h3>
                Message
            </h3>

            <p style="line-height: 1.7; white-space: pre-line;">
                {{ $contactMessage }}
            </p>

        </div>

        <div style="background: #f8f8f8; padding: 20px 30px; font-size: 12px; color: #777;">
            This message was submitted through the TrendPulse Contact Us form.
        </div>

    </div>

</body>
</html>