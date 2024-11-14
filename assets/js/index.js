document.addEventListener('DOMContentLoaded', () => {
  const formCadastrarMeta = document.getElementById('formCadastrarMeta');
  const msgError = document.getElementById('msgError');
  const msgSuccess = document.getElementById('msgSuccess');
  const logado = document.getElementById('logado');


  const userLogado = JSON.parse(localStorage.getItem('userLogado'));


  if (logado && userLogado) {
    logado.innerHTML = `Bem-vindo, ${userLogado.email}!`;
  } else {
    logado.innerHTML = 'Bem-vindo!';
  }


  async function cadastrarMeta(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;

    if (!titulo || !descricao) {
      msgError.style.display = 'block';
      msgError.innerHTML = 'Preencha todos os campos corretamente!';
      msgSuccess.style.display = 'none';
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      msgError.style.display = 'block';
      msgError.innerHTML = 'Usuário não autenticado!';
      msgSuccess.style.display = 'none';
      return;
    }

    console.log('Dados enviados:', { titulo, descricao });

    try {
      const response = await fetch('http://localhost:8000/metas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo, descricao }),
      });

      if (response.ok) {
        msgSuccess.style.display = 'block';
        msgSuccess.innerHTML = 'Meta cadastrada com sucesso!';
        msgError.style.display = 'none';
        formCadastrarMeta.reset();
        listarMetas();
      } else {
        throw new Error('Erro ao cadastrar meta.');
      }
    } catch (error) {
      msgError.style.display = 'block';
      msgError.innerHTML = error.message;
      msgSuccess.style.display = 'none';
    }
  }

  formCadastrarMeta.addEventListener('submit', cadastrarMeta);


  async function listarMetas() {
    const status = document.getElementById('status').value;
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Usuário não autenticado!');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8000/metas?status=${status}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const metas = await response.json();
      const listaMetas = document.getElementById('listaMetas');
      listaMetas.innerHTML = '';
  
      if (metas.length > 0) {
        const ul = document.createElement('ul');
        metas.forEach((meta) => {
          const li = document.createElement('li');
          li.innerHTML = `
            <h3>${meta.titulo}</h3>
            <p>${meta.descricao}</p>
            <button onclick="openEditModal(${meta.id_meta}, '${meta.titulo}', '${meta.descricao}')">Editar</button>
            <button onclick="confirmDelete(${meta.id_meta})">Deletar</button>
          `;
          ul.appendChild(li);
        });
        listaMetas.appendChild(ul);
      } else {
        listaMetas.innerHTML = '<p>Nenhuma meta encontrada.</p>';
      }
    } catch (error) {
      console.error('Erro ao listar metas:', error);
      document.getElementById('listaMetas').innerHTML = '<p>Erro ao carregar metas.</p>';
    }
  }
  



  listarMetas();


  function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('userLogado');
    window.location.href = './assets/html/signin.html';
  }


  document.getElementById('formEditarMeta').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id_meta = document.getElementById('metaId').value;
    const titulo = document.getElementById('editTitulo').value;
    const descricao = document.getElementById('editDescricao').value;
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Usuário não autenticado!');
      return;
    }

    try {
console.log(JSON.stringify({ id_meta, titulo, descricao }),);


      const response = await fetch('http://localhost:8000/updateMeta', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id_meta, titulo, descricao }),
      });

      const data = await response.json();

      if (response.ok) {
        document.getElementById('editMsgSuccess').style.display = 'block';
        document.getElementById('editMsgSuccess').innerHTML = 'Meta atualizada com sucesso!';
        document.getElementById('editMsgError').style.display = 'none';
        closeModal();
        listarMetas(); 
      } else {
        throw new Error(data.message || 'Erro ao atualizar meta.');
      }
    } catch (error) {
      document.getElementById('editMsgError').style.display = 'block';
      document.getElementById('editMsgError').innerHTML = error.message;
      document.getElementById('editMsgSuccess').style.display = 'none';
    }
  });
  window.openEditModal = function (id, titulo, descricao) {
    document.getElementById('metaId').value = id;
    document.getElementById('editTitulo').value = titulo;
    document.getElementById('editDescricao').value = descricao;
    document.getElementById('editModal').style.display = 'block';
  };
  

  window.closeModal = function () {
    document.getElementById('editModal').style.display = 'none';
  };

  window.confirmDelete = function (id_meta) {
    const confirmModal = document.getElementById('confirmDeleteModal');
    confirmModal.style.display = 'block';
    document.getElementById('deleteMetaId').value = id_meta;
  };
  

  window.deleteMeta = async function () {
    const id_meta = document.getElementById('deleteMetaId').value;
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('Usuário não autenticado!');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/metas', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id_meta }),
      });
  
      if (response.ok) {
        alert('Meta deletada com sucesso!');
        listarMetas(); 
      } else {
        throw new Error('Erro ao deletar meta.');
      }
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
    } finally {
      closeConfirmModal();
    }
  };
  

  window.closeConfirmModal = function () {
    document.getElementById('confirmDeleteModal').style.display = 'none';
  };
  

  window.sair = sair;
  window.listarMetas = listarMetas;

});
