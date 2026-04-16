/* Input da Data e hora local atualizada */
function clockUpdate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateHour = `${year}-${month}-${day}T${hour}:${minutes}`;

    document.getElementById('datetime-LocalSolicitation').value = dateHour;
} 

clockUpdate();

setInterval(clockUpdate, 1000);