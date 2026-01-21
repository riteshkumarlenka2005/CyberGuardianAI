"""
Email Service for CyberGuardian AI.
Handles sending verification emails via SMTP.
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from ..security.config import settings


def get_verification_email_html(first_name: str, verification_code: str) -> str:
    """Generate HTML email template with prominent OTP code display."""
    return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0B0F19;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 500px; background: linear-gradient(135deg, #1a1f2e 0%, #0f1623 100%); border: 1px solid #7c3aed33; border-radius: 8px;">
                    <tr>
                        <td style="padding: 40px;">
                            <!-- Logo/Header -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #a855f7; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: 2px;">
                                    🛡️ CYBERGUARDIAN AI
                                </h1>
                            </div>
                            
                            <!-- Main Content -->
                            <div style="background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 30px; margin-bottom: 25px;">
                                <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 15px 0; font-weight: 600; text-align: center;">
                                    Verify Your Email Address
                                </h2>
                                <p style="color: #8b949e; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                                    Hi {first_name}, use this code to verify your email:
                                </p>
                                
                                <!-- OTP CODE - PROMINENT DISPLAY -->
                                <div style="text-align: center; margin: 30px 0;">
                                    <div style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); padding: 20px 40px; border-radius: 8px;">
                                        <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #ffffff; font-family: 'Courier New', monospace;">
                                            {verification_code}
                                        </span>
                                    </div>
                                </div>
                                
                                <p style="color: #6e7681; font-size: 14px; line-height: 1.5; margin: 25px 0 0 0; text-align: center;">
                                    Enter this code on the verification page to activate your account.
                                </p>
                                
                                <p style="color: #6e7681; font-size: 13px; line-height: 1.5; margin: 15px 0 0 0; text-align: center;">
                                    ⏱️ This code expires in <strong style="color: #a855f7;">15 minutes</strong>
                                </p>
                            </div>
                            
                            <!-- Footer -->
                            <div style="text-align: center; border-top: 1px solid #30363d; padding-top: 20px;">
                                <p style="color: #484f58; font-size: 12px; margin: 0;">
                                    If you didn't create an account, you can safely ignore this email.
                                </p>
                                <p style="color: #484f58; font-size: 11px; margin: 10px 0 0 0;">
                                    © 2026 CyberGuardian AI - Cybersecurity Training Platform
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""


def get_verification_email_text(first_name: str, verification_code: str) -> str:
    """Generate plain text email for verification."""
    return f"""
CyberGuardian AI - Verify Your Email

Hi {first_name},

Your verification code is:

    {verification_code}

Enter this code on the verification page to activate your account.

This code expires in 15 minutes.

If you didn't create an account, you can safely ignore this email.

---
CyberGuardian AI - Cybersecurity Training Platform
"""


async def send_verification_email(
    to_email: str,
    first_name: str,
    verification_token: str
) -> bool:
    """
    Send verification email via SMTP with OTP code.
    
    Returns True if email was sent successfully, False otherwise.
    """
    # Check if SMTP is configured
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print(f"[EMAIL] SMTP not configured. Skipping email to {to_email}")
        print(f"[EMAIL] Configure SMTP_USER and SMTP_PASSWORD in .env")
        print(f"[DEV] Verification Code: {verification_token}")
        return False
    
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = "Your CyberGuardian AI Verification Code"
        message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        message["To"] = to_email
        
        # Add plain text and HTML versions
        text_content = get_verification_email_text(first_name, verification_token)
        html_content = get_verification_email_html(first_name, verification_token)
        
        message.attach(MIMEText(text_content, "plain"))
        message.attach(MIMEText(html_content, "html"))
        
        # Send email via SMTP
        context = ssl.create_default_context()
        
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM_EMAIL, to_email, message.as_string())
        
        print(f"[EMAIL] Verification code sent to {to_email}")
        return True
        
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send email to {to_email}: {str(e)}")
        print(f"[DEV FALLBACK] Verification Code: {verification_token}")
        return False
