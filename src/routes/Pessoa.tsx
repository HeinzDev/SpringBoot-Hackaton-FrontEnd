import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import Bubbles from '../components/Bubbles/Bubbles.tsx';
import Profile from '../components/Profile/Profile.tsx';
import PessoaForm from '../components/PessoaForm/PessoaForm.tsx';

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

  const [createFormVisible, setCreateFormVisible] = useState<boolean>(false);
  // const [editFormvisible, setEditFormVisible] = useState<boolean>(false);

  const handleFetchUF = async () => {
    try {
      const response = await axios.get('http://localhost:8080/pessoa/all');
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

    if (form.login) params.login = form.login;
    if (form.nome) params.nome = form.nome;
    if (form.status > 0) params.status = form.status;
    if (form.codigoPessoa > 0) params.codigoPessoa = form.codigoPessoa;

    try {
      const response = await axios.get('http://localhost:8080/pessoa', {
        params,
      });
      let pessoas = response.data;

      if (!Array.isArray(pessoas)) {
        pessoas = [pessoas];
      }

      if (pessoas.length > 0) {
        setUfs(pessoas);
      } else {
        alert('Pessoa não encontrada!');
        setUfs([]);
      }
    } catch (error) {
      console.error('Erro ao consultar Pessoa:', error);
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

  const handleCloseForm = () => {
    setCreateFormVisible(false);
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
      <button
        className="create-pessoa"
        onClick={() => setCreateFormVisible(true)}
      >
        <i className="fa-solid fa-plus"></i>
      </button>

      {profileVisible && selectedCode && (
        <div className="profile-container">
          <Profile code={selectedCode} onClose={handleCloseProfile} />
        </div>
      )}

      {createFormVisible && (
        <div className="create-pessoa-form">
          <PessoaForm onClose={handleCloseForm} />
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
          <label htmlFor="login">login</label>
          <input
            type="text"
            name="login"
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

        <div className="crud-buttons-pessoa">
          <button onClick={handleConsultUF}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UFComponent;
