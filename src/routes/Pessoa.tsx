import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import Bubbles from '../components/Bubbles/Bubbles.tsx';
import Profile from '../components/Profile/Profile.tsx';

interface UF {
  codigoPessoa: number;
  nome: string;
  login: string;
  status: number;
}

const UFComponent: React.FC = () => {
  const [ufs, setUfs] = useState<UF[]>([]);
  const [form, setForm] = useState<UF>({
    codigoPessoa: 0,
    login: '',
    nome: '',
    status: 0,
  });
  const [profileVisible, setProfileVisible] = useState<boolean>(false);
  const [selectedCode, setSelectedCode] = useState<number | null>(null);

  const handleFetchUF = async () => {
    try {
      const response = await axios.get('http://localhost:8080/pessoa?status=1');
      setUfs(response.data);
    } catch (error) {
      console.error('Erro ao buscar as UFs:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => handleFetchUF(), 200);
    return () => clearTimeout(timeoutId); //sem isso ele atualiza pra sempre
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    setForm({
      ...form,
      status: checked ? parseInt(value) : 0,
    });
  };

  const handleConsultUF = async () => {
    const params: Record<string, string | number> = {};

    if (form.login) params.sigla = form.login;
    if (form.nome) params.nome = form.nome;
    if (form.status > 0) params.status = form.status;
    if (form.codigoPessoa > 0) params.codigoPessoa = form.codigoPessoa;

    try {
      const response = await axios.get('http://localhost:8080/uf', { params });
      let ufsFound = response.data;

      if (!Array.isArray(ufsFound)) {
        ufsFound = [ufsFound];
      }

      if (ufsFound.length > 0) {
        setUfs(ufsFound);
      } else {
        alert('UF não encontrada!');
        setUfs([]);
      }
    } catch (error) {
      console.error('Erro ao consultar UF:', error);
    }
  };

  const handleCreateUF = async () => {
    try {
      await axios.post('http://localhost:8080/uf', {
        nome: form.nome,
        sigla: form.login,
        status: form.status,
      });
      alert('UF criada com sucesso!');
      setForm({ codigoPessoa: 0, login: '', nome: '', status: 0 });
      handleFetchUF();
    } catch (error) {
      console.error('Erro ao criar UF:', error);
      alert('Erro ao criar UF!');
    }
  };

  const handleUpdateUF = async () => {
    if (!form.codigoPessoa) {
      alert('Informe o código da UF para atualização');
      return;
    }

    try {
      await axios.put('http://localhost:8080/uf', {
        codigoPessoa: form.codigoPessoa,
        login: form.login,
        nome: form.nome,
        status: form.status,
      });
      alert('UF atualizada com sucesso!');
      setForm({ codigoPessoa: 0, login: '', nome: '', status: 0 });
      handleFetchUF();
    } catch (error) {
      console.error('Erro ao atualizar UF:', error);
      alert('Erro ao atualizar UF!');
    }
  };

  const handleShowProfile = (code: number) => {
    setSelectedCode(code);
    setProfileVisible(true);
  };

  const handleCloseProfile = () => {
    setProfileVisible(false);
    setSelectedCode(null);
  };

  return (
    <div className="relative-container">
      <h2>Pessoa</h2>
      <div className="response">
        {ufs.length > 0 ? (
          ufs.map(
            (uf) =>
              uf && //sem isso && ele dispara erro
              uf.codigoPessoa !== undefined && (
                <Bubbles
                  key={uf.codigoPessoa}
                  name={uf.nome}
                  code={uf.codigoPessoa.toString()}
                  description="Login"
                  data={uf.login}
                  status={uf.status}
                  onClick={() => handleShowProfile(uf.codigoPessoa)} // chama ao clicar
                />
              )
          )
        ) : (
          <p></p>
        )}
      </div>

      <button className="refresh" onClick={handleFetchUF}>
        <i className="fa-solid fa-arrows-rotate"></i>
      </button>

      {profileVisible && selectedCode && (
        <div className="profile-container">
          <Profile code={selectedCode} onClose={handleCloseProfile} />
        </div>
      )}

      <div className="form-container">
        <div className="form">
          <label>
            <b>Código</b>
          </label>
          <input
            type="text"
            name="codigoPessoa"
            value={form.codigoPessoa.toString()}
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
            value={form.login}
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
        </div>
      </div>
    </div>
  );
};

export default UFComponent;
