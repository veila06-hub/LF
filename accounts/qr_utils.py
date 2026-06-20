import qrcode
import os

def generate_qr(claim_id):

    folder = "media/qrcodes"

    os.makedirs(folder, exist_ok=True)

    filename = f"{claim_id}.png"

    filepath = os.path.join(
        folder,
        filename
    )

    img = qrcode.make(claim_id)

    img.save(filepath)

    return filepath