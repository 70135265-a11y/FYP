import requests
import os
from dotenv import load_dotenv

load_dotenv()

def send_welcome_email(to_email: str, name: str):
    """
    Send a welcome email to the user after successful registration using Resend API.
    """
    try:
        api_key = os.getenv("RESEND_API_KEY")
        
        # Resend API endpoint
        url = "https://api.resend.com/emails"
        
        # Email body
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #2563eb; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0;">Welcome to LiverAI Cirrhosis Detection!</h1>
                </div>
                <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
                    <p style="font-size: 16px;">Dear {name},</p>
                    <p style="font-size: 16px;">Thank you for registering with LiverAI. We're excited to have you on board!</p>
                    <p style="font-size: 16px;">Your account has been successfully created and you can now start using our platform to manage your medical scans and receive AI-powered liver Cirrhosis disease analysis.</p>
                    <p style="font-size: 16px;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                    <p style="font-size: 16px;">Best regards,<br>The LiverAI Cirrhosis Team</p>
                    <p style="font-size: 16px;">Contact,<br>70135265@student.uol.edu.pk</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Email payload - send to your verified email for testing
        payload = {
            "from": "LiverAI <onboarding@resend.dev>",
            "to": ["70135265@student.uol.edu.pk"],
            "subject": f"Welcome to LiverAI! (Registration for: {to_email})",
            "html": html_content
        }
        
        # Headers
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        # Send email
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 200:
            print(f"Welcome email sent successfully to {to_email}")
            return True
        else:
            print(f"Failed to send email to {to_email}: {response.status_code} - {response.text}")
            return False
        
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")
        return False


def send_password_reset_email(to_email: str, reset_token: str, name: str = None):
    """
    Send a password reset email to the user using Resend API.
    """
    try:
        api_key = os.getenv("RESEND_API_KEY")
        
        # Resend API endpoint
        url = "https://api.resend.com/emails"
        
        # Frontend URL for password reset (update this to your frontend URL)
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        reset_link = f"{frontend_url}/reset-password?token={reset_token}"
        
        # Email body
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #2563eb; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0;">Password Reset Request</h1>
                </div>
                <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
                    <p style="font-size: 16px;">{"Dear " + name + "," if name else "Hello,"}</p>
                    <p style="font-size: 16px;">We received a request to reset your password for your LiverAI account.</p>
                    <p style="font-size: 16px;">Click the link below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_link}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block;">Reset Password</a>
                    </div>
                    <p style="font-size: 14px; color: #666;">This link will expire in 1 hour.</p>
                    <p style="font-size: 14px; color: #666;">If you didn't request this password reset, please ignore this email.</p>
                    <p style="font-size: 16px;">Best regards,<br>The LiverAI Team</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Email payload - send to your verified email for testing
        payload = {
            "from": "LiverAI <onboarding@resend.dev>",
            "to": ["70135265@student.uol.edu.pk"],
            "subject": "Reset Your LiverAI Password",
            "html": html_content
        }
        
        # Headers
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        # Send email
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 200:
            print(f"Password reset email sent successfully to {to_email}")
            return True
        else:
            print(f"Failed to send email to {to_email}: {response.status_code} - {response.text}")
            return False
        
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")
        return False
