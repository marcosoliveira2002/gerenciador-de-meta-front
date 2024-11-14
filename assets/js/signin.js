let btn = document.querySelector('.fa-eye');

btn.addEventListener('click', () => {
  let inputSenha = document.querySelector('#senha');

  if (inputSenha.getAttribute('type') === 'password') {
    inputSenha.setAttribute('type', 'text');
  } else {
    inputSenha.setAttribute('type', 'password');
  }
});

async function entrar() {
  let usuario = document.querySelector('#usuario');
  let userLabel = document.querySelector('#userLabel');

  let senha = document.querySelector('#senha');
  let senhaLabel = document.querySelector('#senhaLabel');

  let msgError = document.querySelector('#msgError');

  if (!usuario.value || !senha.value) {
    userLabel.setAttribute('style', 'color: red');
    usuario.setAttribute('style', 'border-color: red');
    senhaLabel.setAttribute('style', 'color: red');
    senha.setAttribute('style', 'border-color: red');
    msgError.setAttribute('style', 'display: block');
    msgError.innerHTML = 'Preencha todos os campos!';
    return;
  }

  try {
    console.log(JSON.stringify({
      email: usuario.value,
      senha: senha.value,
    }));

    const response = await fetch('http://localhost:8000/usuarioLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: usuario.value,
        senha: senha.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userLogado', JSON.stringify({ email: usuario.value }));

        window.location.href = '../../index.html';
      } else {
        throw new Error(data.error || 'Autenticação falhou');
      }
    } else {
      throw new Error('Erro na requisição');
    }

  } catch (error) {
    console.log(error.message);

    userLabel.setAttribute('style', 'color: red');
    usuario.setAttribute('style', 'border-color: red');
    senhaLabel.setAttribute('style', 'color: red');
    senha.setAttribute('style', 'border-color: red');
    msgError.setAttribute('style', 'display: block');
    msgError.innerHTML = error.message;
    usuario.focus();
  }
}
