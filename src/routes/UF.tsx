import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios'; // Importa o axios
import Bubbles from '../components/Bubbles/Bubbles.tsx';

interface UF {
  codigoUF: number;
  sigla: string;
  nome: string;
  status: number;
}

const UFComponent: React.FC = () => {
  const [ufs, setUfs] = useState<UF[]>([]); // Armazena as UFs encontradas
  const [form, setForm] = useState<UF>({
    codigoUF: 0,
    sigla: '',
    nome: '',
    status: 0,
  });

  const handleFetchUF = async () => {
    try {
      const response = await axios.get('http://localhost:8080/uf/all');
      setUfs(response.data); // Atualiza a lista de UFs no estado
    } catch (error) {
      console.error('Erro ao buscar as UFs:', error);
    }
  };

  useEffect(() => {
    setTimeout(() => handleFetchUF(), 200);
  });

  // Função para lidar com a mudança nos campos de entrada do formulário
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Função para tratar a mudança na checkbox de status
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    setForm({
      ...form,
      status: checked ? parseInt(value) : 0, // Se marcado, define o status como o valor da checkbox, caso contrário 0
    });
  };

  // Função para buscar as UFs com base nos parâmetros fornecidos
  const handleConsultUF = async () => {
    const params: Record<string, string | number> = {};

    if (form.sigla) params.sigla = form.sigla; // Adiciona o parâmetro sigla se preenchido
    if (form.nome) params.nome = form.nome; // Adiciona o parâmetro nome se preenchido
    if (form.status > 0) params.status = form.status; // Adiciona o parâmetro status se marcado
    if (form.codigoUF > 0) params.codigoUF = form.codigoUF; // Adiciona o parâmetro codigoUF se preenchido

    try {
      const response = await axios.get('http://localhost:8080/uf', { params });
      let ufsFound = response.data;

      // Se a resposta for um único objeto, transforme-o em um array com um item
      if (!Array.isArray(ufsFound)) {
        ufsFound = [ufsFound];
      }

      if (ufsFound.length > 0) {
        setUfs(ufsFound); // Atualiza a lista de UFs encontradas
      } else {
        alert('UF não encontrada!');
        setUfs([]); // Limpa a lista caso não encontre
      }
    } catch (error) {
      console.error('Erro ao consultar UF:', error);
    }
  };

  // Função para criar uma nova UF
  const handleCreateUF = async () => {
    try {
      const response = await axios.post('http://localhost:8080/uf', {
        nome: form.nome,
        sigla: form.sigla,
        status: form.status,
      });
      alert('UF criada com sucesso!');
      setUfs([...ufs, response.data]); // Adiciona a nova UF na lista
      setForm({ codigoUF: 0, sigla: '', nome: '', status: 0 }); // Limpa o formulário
      handleFetchUF();
    } catch (error) {
      console.error('Erro ao criar UF:', error);
      alert('Erro ao criar UF!');
    }
  };

  // Função para atualizar uma UF existente
  const handleUpdateUF = async () => {
    if (!form.codigoUF) {
      alert('Informe o código da UF para atualização');
      return;
    }

    try {
      const response = await axios.put('http://localhost:8080/uf', {
        codigoUF: form.codigoUF,
        sigla: form.sigla,
        nome: form.nome,
        status: form.status,
      });
      alert('UF atualizada com sucesso!');
      setUfs(
        ufs.map((uf) => (uf.codigoUF === form.codigoUF ? response.data : uf))
      ); // Atualiza a UF na lista
      setForm({ codigoUF: 0, sigla: '', nome: '', status: 0 }); // Limpa o formulário
      handleFetchUF();
    } catch (error) {
      console.error('Erro ao atualizar UF:', error);
      alert('Erro ao atualizar UF!');
    }
  };

  // Função para excluir uma UF
  const handleDeleteUF = async () => {
    if (!form.codigoUF) {
      alert('Informe o código da UF para exclusão');
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/uf?code=${form.codigoUF}`);
      alert('UF deletada com sucesso!');
      setUfs(ufs.filter((uf) => uf.codigoUF !== form.codigoUF)); // Remove a UF da lista
      setForm({ codigoUF: 0, sigla: '', nome: '', status: 0 }); // Limpa o formulário
      handleFetchUF();
    } catch (error) {
      console.error('Erro ao deletar UF:', error);
      alert('Erro ao deletar UF!');
    }
  };

  return (
    <div className="relative-container">
      <h2>UF</h2>
      <div className="response">
        {ufs.length > 0 ? (
          ufs.map((uf) => (
            <Bubbles
              key={uf.codigoUF}
              name={uf.nome}
              code={uf.codigoUF.toString()}
              description="Sigla"
              data={uf.sigla}
              status={uf.status}
            />
          ))
        ) : (
          <p></p>
        )}
      </div>

      <button className="refresh" onClick={handleFetchUF}>
        <i className="fa-solid fa-arrows-rotate"></i>
      </button>

      <div className="form-container">
        <div className="form">
          <label>
            <b>Código</b>
          </label>
          <input
            type="text"
            name="codigoUF"
            value={form.codigoUF.toString()}
            onChange={handleInputChange}
          />
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleInputChange}
          />
          <label htmlFor="sigla">Sigla</label>
          <input
            type="text"
            name="sigla"
            value={form.sigla}
            onChange={handleInputChange}
          />
          <div className="status-container">
            <span>Status: </span>
            <label htmlFor="status1">1</label>
            <input
              id="status1"
              type="checkbox"
              value="1"
              checked={form.status === 1}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="status2">2</label>
            <input
              id="status2"
              type="checkbox"
              value="2"
              checked={form.status === 2}
              onChange={handleCheckboxChange}
            />
          </div>
        </div>

        <div className="crud-buttons">
          <button onClick={handleConsultUF}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <button onClick={handleCreateUF}>
            <i className="fa-solid fa-plus"></i>
          </button>
          <button onClick={handleUpdateUF}>
            <i className="fa-solid fa-pencil"></i>
          </button>
          <button onClick={handleDeleteUF}>
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UFComponent;
