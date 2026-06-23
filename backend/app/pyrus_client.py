from dataclasses import dataclass
from time import monotonic

import httpx

from backend.app.core.config import get_settings

PYRUS_AUTH_URL = "https://accounts.pyrus.com/api/v4/auth"


@dataclass
class PyrusAuthState:
    access_token: str
    api_url: str
    files_url: str
    received_at: float


class PyrusClient:
    def __init__(self) -> None:
        self.settings = get_settings()
        self._auth_state: PyrusAuthState | None = None

    async def authenticate(self, force: bool = False) -> PyrusAuthState:
        if self._auth_state and not force:
            return self._auth_state

        if not self.settings.pyrus_enabled:
            raise RuntimeError("Pyrus integration is disabled")
        if not self.settings.pyrus_login or not self.settings.pyrus_security_key:
            raise RuntimeError("Pyrus credentials are not configured")

        payload = {
            "login": self.settings.pyrus_login,
            "security_key": self.settings.pyrus_security_key,
        }

        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(PYRUS_AUTH_URL, json=payload)
            response.raise_for_status()
            data = response.json()

        self._auth_state = PyrusAuthState(
            access_token=data["access_token"],
            api_url=data.get("api_url", "https://api.pyrus.com/v4/"),
            files_url=data.get("files_url", "https://files.pyrus.com/"),
            received_at=monotonic(),
        )
        return self._auth_state

    async def health(self) -> dict[str, str | bool]:
        auth = await self.authenticate()
        return {
            "enabled": True,
            "api_url": auth.api_url,
            "files_url": auth.files_url,
            "token_received": True,
        }


pyrus_client = PyrusClient()
