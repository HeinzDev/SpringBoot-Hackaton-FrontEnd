import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import Bubbles from '../components/Bubbles/Bubbles.tsx';

interface Municipio {
  codigoMunicipio: number;
  codigoUF: number;
  nome: string;
  status: number;
}

const Municipio: React.FC = () => {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [form, setForm] = useState<Municipio>({
    codigoMunicipio: 0,
    codigoUF: 0,
    nome: '',
    status: 0,
  });

  const handleFetchMunicipio = async () => {
    try {
      const response = await axios.get('http://localhost:8080/municipio/all');
      setMunicipios(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar os municípios:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => handleFetchMunicipio(), 200);
    return () => clearTimeout(timeoutId);
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

  const handleConsultMunicipio = async () => {
    const params: Record<string, string | number> = {};

    if (form.nome) params.nome = form.nome;
    if (form.status > 0) params.status = form.status;
    if (form.codigoUF > 0) params.codigoUF = form.codigoUF;
    if (form.codigoMunicipio > 0) params.codigoMunicipio = form.codigoMunicipio;

    try {
      const response = await axios.get('http://localhost:8080/municipio', {
        params,
      });
      let municipiosFound = response.data;

      if (!Array.isArray(municipiosFound)) {
        municipiosFound = [municipiosFound];
      }

      if (municipiosFound.length > 0) {
        setMunicipios(municipiosFound);
      } else {
        alert('Município não encontrado!');
        setMunicipios([]);
      }
    } catch (error) {
      console.error('Erro ao consultar município:', error);
    }
  };

  const handleCreateMunicipio = async () => {
    try {
      const response = await axios.post('http://localhost:8080/municipio', {
        nome: form.nome,
        codigoUF: form.codigoUF,
        status: form.status,
      });
      alert('Município criado com sucesso!');
      setMunicipios([...municipios, response.data]);
      setForm({ codigoMunicipio: 0, codigoUF: 0, nome: '', status: 0 });
      setTimeout(() => handleFetchMunicipio(), 1000);
    } catch (error) {
      console.error('Erro ao criar municipio:', error);
      alert('Erro ao criar município!');
    }
  };

  const handleUpdateMunicipio = async () => {
    if (!form.codigoMunicipio) {
      alert('Informe o código do município');
      return;
    }

    try {
      await axios.put('http://localhost:8080/municipio', {
        codigoMunicipio: form.codigoMunicipio,
        codigoUF: form.codigoUF,
        nome: form.nome,
        status: form.status,
      });
      alert('Município atualizado com sucesso!');

      setForm({ codigoMunicipio: 0, codigoUF: 0, nome: '', status: 0 });

      setTimeout(() => handleFetchMunicipio(), 1000);
    } catch (error) {
      console.error('Erro ao atualizar município:', error);
      alert('Erro ao atualizar município!');
    }
  };

  const handleDeleteMunicipio = async () => {
    if (!form.codigoMunicipio) {
      alert('Informe o código da município para exclusão');
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/municipio?code=${form.codigoMunicipio}`
      );
      alert('Município deletado com sucesso!');
      setForm({ codigoMunicipio: 0, codigoUF: 0, nome: '', status: 0 });
      handleFetchMunicipio();
    } catch (error) {
      console.error('Erro ao deletar município:', error);
      alert('Erro ao deletar município!');
    }
  };

  return (
    <div className="relative-container">
      <h2>Municípios</h2>
      <div className="response">
        {municipios && municipios.length > 0 ? (
          municipios.map((municipio) => (
            <Bubbles
              key={municipio.codigoMunicipio}
              name={municipio.nome}
              code={
                municipio.codigoMunicipio
                  ? municipio.codigoMunicipio.toString()
                  : ''
              }
              description="UF"
              data={municipio.codigoUF ? municipio.codigoUF.toString() : ''}
              status={municipio.status}
              onClick={() => {}}
            />
          ))
        ) : (
          <p></p>
        )}
      </div>

      <button className="refresh" onClick={handleFetchMunicipio}>
        <i className="fa-solid fa-arrows-rotate"></i>
      </button>

      <div className="form-container">
        <div className="form">
          <label>
            <b>Código</b>
          </label>
          <input
            type="text"
            name="codigoMunicipio"
            value={form.codigoMunicipio ? form.codigoMunicipio.toString() : ''}
            onChange={handleInputChange}
          />
          <label>
            <b>Código da UF</b>
          </label>
          <input
            type="text"
            name="codigoUF"
            value={form.codigoUF ? form.codigoUF.toString() : ''}
            onChange={handleInputChange}
          />
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
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
          <button onClick={handleConsultMunicipio}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <button onClick={handleCreateMunicipio}>
            <i className="fa-solid fa-plus"></i>
          </button>
          <button onClick={handleUpdateMunicipio}>
            <i className="fa-solid fa-pencil"></i>
          </button>
          <button onClick={handleDeleteMunicipio}>
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Municipio;
