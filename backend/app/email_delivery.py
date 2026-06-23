import logging
import smtplib
from email.message import EmailMessage

from backend.app.core.config import get_settings

logger = logging.getLogger(__name__)


def send_email_code(email: str, code: str) -> None:
    settings = get_settings()
    subject = "Код входа в Kord Support"
    body = f"Ваш код входа в Kord Support: {code}\n\nКод действует 10 минут."

    if not settings.smtp_enabled:
        logger.warning("EMAIL CODE for %s: %s", email, code)
        return

    if not settings.smtp_host or not settings.smtp_from:
        logger.warning("SMTP is enabled but not configured. EMAIL CODE for %s: %s", email, code)
        return

    message = EmailMessage()
    message["From"] = settings.smtp_from
    message["To"] = email
    message["Subject"] = subject
    message.set_content(body)

    smtp_ssl = getattr(settings, "smtp_ssl", False) or int(settings.smtp_port) == 465
    smtp_cls = smtplib.SMTP_SSL if smtp_ssl else smtplib.SMTP

    with smtp_cls(settings.smtp_host, settings.smtp_port, timeout=20) as smtp:
        if settings.smtp_starttls and not smtp_ssl:
            smtp.starttls()
        if settings.smtp_username and settings.smtp_password:
            smtp.login(settings.smtp_username, settings.smtp_password)
        smtp.send_message(message)
