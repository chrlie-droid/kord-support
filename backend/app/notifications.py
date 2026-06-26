import logging
import smtplib
from dataclasses import dataclass
from email.message import EmailMessage
from typing import Literal

import httpx

from backend.app.core.config import get_settings

logger = logging.getLogger(__name__)

DeliveryMode = Literal['sent', 'logged', 'logged_fallback', 'failed']


@dataclass
class NotificationResult:
    provider: str
    mode: DeliveryMode
    detail: str | None = None


class NotificationCenter:
    def send_email_code(self, email: str, code: str) -> NotificationResult:
        subject = 'Код входа в Kord Support'
        text = f'Ваш код входа в Kord Support: {code}\n\nКод действует 10 минут.'
        html = f'''
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
          <h2>Kord Support</h2>
          <p>Ваш код входа:</p>
          <div style="font-size:28px;font-weight:700;letter-spacing:4px">{code}</div>
          <p style="color:#6b7280">Код действует 10 минут.</p>
        </div>
        '''
        return self.send_email(to=email, subject=subject, text=text, html=html)

    def send_email(self, *, to: str, subject: str, text: str, html: str | None = None) -> NotificationResult:
        settings = get_settings()
        provider = (settings.email_provider or 'smtp').lower()

        if provider == 'resend':
            return self._send_resend(to=to, subject=subject, text=text, html=html)
        return self._send_smtp(to=to, subject=subject, text=text, html=html)

    def _send_resend(self, *, to: str, subject: str, text: str, html: str | None = None) -> NotificationResult:
        settings = get_settings()
        if not settings.resend_api_key or not settings.email_from:
            logger.warning('EMAIL CODE fallback for %s: Resend is not configured', to)
            return NotificationResult(provider='resend', mode='logged_fallback', detail='Resend is not configured')

        payload = {
            'from': settings.email_from,
            'to': [to],
            'subject': subject,
            'text': text,
        }
        if html:
            payload['html'] = html

        try:
            with httpx.Client(timeout=15) as client:
                response = client.post(
                    'https://api.resend.com/emails',
                    headers={'Authorization': f'Bearer {settings.resend_api_key}', 'Content-Type': 'application/json'},
                    json=payload,
                )
                response.raise_for_status()
            return NotificationResult(provider='resend', mode='sent')
        except Exception as exc:
            logger.error('Resend delivery failed for %s: %s', to, exc)
            return NotificationResult(provider='resend', mode='logged_fallback', detail=str(exc))

    def _send_smtp(self, *, to: str, subject: str, text: str, html: str | None = None) -> NotificationResult:
        settings = get_settings()
        if not settings.smtp_enabled:
            return NotificationResult(provider='smtp', mode='logged', detail='SMTP disabled')

        if not settings.smtp_host or not settings.smtp_from:
            return NotificationResult(provider='smtp', mode='logged_fallback', detail='SMTP is not configured')

        message = EmailMessage()
        message['From'] = settings.smtp_from
        message['To'] = to
        message['Subject'] = subject
        message.set_content(text)
        if html:
            message.add_alternative(html, subtype='html')

        smtp_ssl = getattr(settings, 'smtp_ssl', False) or int(settings.smtp_port) == 465
        smtp_cls = smtplib.SMTP_SSL if smtp_ssl else smtplib.SMTP

        try:
            with smtp_cls(settings.smtp_host, settings.smtp_port, timeout=10) as smtp:
                if settings.smtp_starttls and not smtp_ssl:
                    smtp.starttls()
                if settings.smtp_username and settings.smtp_password:
                    smtp.login(settings.smtp_username, settings.smtp_password)
                smtp.send_message(message)
            return NotificationResult(provider='smtp', mode='sent')
        except Exception as exc:
            logger.error('SMTP delivery failed for %s: %s', to, exc)
            return NotificationResult(provider='smtp', mode='logged_fallback', detail=str(exc))


notification_center = NotificationCenter()
