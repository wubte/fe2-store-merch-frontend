async function loadSettings() {
    const res = await fetch('http://localhost:4000/api/auth/mfa/setup', {credentials:'include'});
    const {otpUrl} = await res.json();
    document.getElementById('qrCode').innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(otpUrl)}&size=150x150">`;
  }
  document.getElementById('saveMfa')?.onclick = async () => {
    const factors = Array.from(document.querySelectorAll('#security input:checked')).map(i => i.value);
    await fetch('http://localhost:4000/api/auth/mfa/enable', {
      method:'POST', credentials:'include',
      headers:{'Content-Type':'application/json'}, body:JSON.stringify({factors})
    });
    alert('Настройки сохранены');
  };
window.onload = loadSettings;