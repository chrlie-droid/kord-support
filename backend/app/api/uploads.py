import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.models import Ticket, TicketComment

router = APIRouter(prefix="/tickets", tags=["uploads"])

UPLOAD_ROOT = Path("/app/uploads/tickets")
ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
}
MAX_FILE_SIZE = 10 * 1024 * 1024


def _safe_suffix(filename: str) -> str:
    suffix = Path(filename).suffix.lower()
    if suffix and len(suffix) <= 16:
        return suffix
    return ""


@router.post("/{ticket_id}/attachments", status_code=status.HTTP_201_CREATED)
def upload_ticket_attachment(
    ticket_id: int,
    author_name: str = "Клиент",
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    ticket = db.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")

    ticket_dir = UPLOAD_ROOT / str(ticket_id)
    ticket_dir.mkdir(parents=True, exist_ok=True)

    stored_name = f"{uuid4().hex}{_safe_suffix(file.filename or '')}"
    target = ticket_dir / stored_name

    size = 0
    with target.open("wb") as buffer:
        while True:
            chunk = file.file.read(1024 * 1024)
            if not chunk:
                break
            size += len(chunk)
            if size > MAX_FILE_SIZE:
                target.unlink(missing_ok=True)
                raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large")
            buffer.write(chunk)

    file_url = f"/uploads/tickets/{ticket_id}/{stored_name}"
    original_name = file.filename or "file"
    is_image = file.content_type.startswith("image/")
    body = f"![{original_name}]({file_url})" if is_image else f"Файл: [{original_name}]({file_url})"

    comment = TicketComment(
        ticket_id=ticket_id,
        author_name=author_name,
        body=body,
        is_internal=False,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return {
        "id": comment.id,
        "ticket_id": ticket_id,
        "filename": original_name,
        "content_type": file.content_type,
        "size": size,
        "url": file_url,
        "comment_id": comment.id,
    }
