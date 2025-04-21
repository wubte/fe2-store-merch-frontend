const api = 'http://localhost:4000/api/auth';
document.querySelector('#loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  await fetch(`${api}/login`, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  document.getElementById('mfaSection').style.display = 'block';
});

document.querySelectorAll('#mfaSection button[data-method]')?.forEach(btn => {
  btn.onclick = async () => {
    const method = btn.getAttribute('data-method');
    if (method==='verify-totp') {
      document.getElementById('otpInput').style.display='block';
      document.getElementById('verifyOtp').onclick = async () => {
        const token = document.getElementById('otpCode').value;
        await verifyOtp('verify-totp', { token });
      };
    } else {
      await verifyOtp(method, {});
      document.getElementById('otpInput').style.display='block';
      document.getElementById('verifyOtp').onclick = async () => {
        const code = document.getElementById('otpCode').value;
        await verifyOtp(`verify-${method}`, { code });
      };
    }
  };
});

async function verifyOtp(path, body) {
  const res = await fetch(`${api}/login/${path}`, {
    method:'POST', credentials:'include',
    headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
  });
  const js = await res.json();
  if (js.token) localStorage.setItem('token', js.token);
  alert(js.message);
}

document.querySelector('#registerForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const res = await fetch(`${api}/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  alert((await res.json()).message);
});