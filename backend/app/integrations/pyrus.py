from dataclasses import dataclass

import httpx

from backend.app.core.config import Settings


class PyrusNotConfigured(RuntimeError):
    pass


@dataclass
class PyrusAuth:
    access_token: str
    api_url: str
    files_url: str


class PyrusClient:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self._auth: PyrusAuth | None = None

    def _ensure_configured(self) -> None:
        if not self.settings.pyrus_enabled:
            raise PyrusNotConfigured("Pyrus integration is disabled")
        if not self.settings.pyrus_login or not self.settings.pyrus_security_key:
            raise PyrusNotConfigured("Pyrus credentials are not configured")

    async def auth(self, force: bool = False) -> PyrusAuth:
        self._ensure_configured()
        if self._auth is not None and not force:
            return self._auth

        payload: dict[str, object] = {
            "login": self.settings.pyrus_login,
            "security_key": self.settings.pyrus_security_key,
        }

        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post("https://accounts.pyrus.com/api/v4/auth", json=payload)
            response.raise_for_status()
            data = response.json()

        self._auth = PyrusAuth(
            access_token=data["access_token"],
            api_url=data.get("api_url", "https://api.pyrus.com/v4/"),
            files_url=data.get("files_url", "https://files.pyrus.com/"),
        )
        return self._auth

    async def _request(self, method: str, path: str, json: dict[str, object] | None = None) -> dict:
        auth = await self.auth()
        url = auth.api_url.rstrip("/") + "/" + path.lstrip("/")
        headers = {"Authorization": f"Bearer {auth.access_token}", "Content-Type": "application/json"}

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.request(method, url, headers=headers, json=json)
            if response.status_code in {401, 403}:
                auth = await self.auth(force=True)
                headers["Authorization"] = f"Bearer {auth.access_token}"
                response = await client.request(method, url, headers=headers, json=json)
            response.raise_for_status()
            return response.json()

    async def create_task(self, text: str) -> int:
        payload: dict[str, object] = {"text": text}
        result = await self._request("POST", "/tasks", json=payload)
        return int(result["task"]["id"])

    async def create_form_task(
        self,
        *,
        form_id: int,
        subject: str,
        description: str,
        sender_name: str | None = None,
        sender_email: str | None = None,
        sender_phone: str | None = None,
    ) -> int:
        # Current Pyrus form mapping from template screenshots:
        # Subject = field 3, Description = field 4.
        # SenderName / Sender Address / u_PhoneNumber can be enabled later after field ids are confirmed.
        fields: list[dict[str, object]] = [
            {"id": 3, "value": subject},
            {"id": 4, "value": description},
        ]

        payload: dict[str, object] = {
            "form_id": form_id,
            "text": subject,
            "fields": fields,
        }

        # Keep identity in text as well until all Pyrus field ids are known.
        identity_lines = []
        if sender_name:
            identity_lines.append(f"Автор: {sender_name}")
        if sender_email:
            identity_lines.append(f"Email: {sender_email}")
        if sender_phone:
            identity_lines.append(f"Телефон: {sender_phone}")
        if identity_lines:
            payload["text"] = subject + "\n\n" + "\n".join(identity_lines)

        result = await self._request("POST", "/tasks", json=payload)
        return int(result["task"]["id"])

    async def add_comment(self, task_id: int, text: str) -> None:
        await self._request("POST", f"/tasks/{task_id}/comments", json={"text": text})
