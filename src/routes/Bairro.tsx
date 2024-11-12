import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import Bubbles from '../components/Bubbles/Bubbles';

interface Bairro {
  codigoBairro: number;
  codigoMunicipio: number;
  nome: string;
  status: number;
}

const Bairro = () => {
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [form, setForm] = useState<Bairro>({
    codigoBairro: 0,
    codigoMunicipio: 0,
    nome: '',
    status: 0,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => handleFetchBairro(), 200);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleFetchBairro = async () => {
    try {
      const response = await axios.get('http://localhost:8080/bairro');
      setBairros(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar os bairros:', error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    setForm({
      ...form,
      status: checked ? parseInt(value) : 0, //workaround, não funciona sem o parse
    });
  };

  const handleConsultBairro = async () => {
    const params: Record<string, string | number> = {};

    if (form.nome) params.nome = form.nome;
    if (form.status > 0) params.status = form.status;
    if (form.codigoMunicipio > 0) params.codigoMunicipio = form.codigoMunicipio;
    if (form.codigoBairro > 0) params.codigoBairro = form.codigoBairro;

    try {
      const response = await axios.get('http://localhost:8080/bairro', {
        params,
      });
      let bairrosFound = response.data;

      if (!Array.isArray(bairrosFound)) {
        bairrosFound = [bairrosFound]; //workaround, não interpreta o objeto isolado
      }

      if (bairrosFound.length > 0) {
        setBairros(bairrosFound);
      } else {
        alert('Município não encontrado!');
        setBairros([]);
      }
    } catch (error) {
      console.error('Erro ao consultar município:', error);
    }
  };

  const handleCreateBairro = async () => {
    try {
      const response = await axios.post('http://localhost:8080/bairro', {
        nome: form.nome,
        codigoMunicipio: form.codigoMunicipio,
        status: form.status,
      });
      alert('Município criado com sucesso!');
      setBairros([...bairros, response.data]);
      setForm({ codigoBairro: 0, codigoMunicipio: 0, nome: '', status: 0 });
      setTimeout(() => handleFetchBairro(), 1000);
    } catch (error) {
      console.error('Erro ao criar município:', error);
      alert('Erro ao criar município!');
    }
  };

  const handleUpdateBairro = async () => {
    if (!form.codigoMunicipio) {
      alert('Informe o código da município para atualização');
      return;
    }

    try {
      const response = await axios.put('http://localhost:8080/bairro', {
        codigoMunicipio: form.codigoMunicipio,
        nome: form.nome,
        status: form.status,
      });
      alert('Município atualizado com sucesso!');
      setBairros(
        bairros.map((bairro) =>
          bairro.codigoMunicipio === form.codigoMunicipio
            ? response.data
            : bairro
        )
      );
      setForm({ codigoBairro: 0, codigoMunicipio: 0, nome: '', status: 0 });

      setTimeout(() => handleFetchBairro(), 1000);
    } catch (error) {
      console.error('Erro ao atualizar município:', error);
      alert('Erro ao atualizar município!');
    }
  };

  const handleDeleteBairro = async () => {
    if (!form.codigoMunicipio) {
      alert('Informe o código da município para exclusão');
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/bairro?codigoMunicipio=${form.codigoMunicipio}`
      );
      alert('Município deletado com sucesso!');
      setBairros(
        bairros.filter(
          (bairro) => bairro.codigoMunicipio !== form.codigoMunicipio
        )
      );
      setForm({ codigoBairro: 0, codigoMunicipio: 0, nome: '', status: 0 });
      handleFetchBairro();
    } catch (error) {
      console.error('Erro ao deletar município:', error);
      alert('Erro ao deletar município!');
    }
  };

  return (
    <div className="relative-container">
      <h2>Bairros</h2>
      <div className="response">
        {bairros.length > 0 ? (
          bairros.map((bairro) => (
            <Bubbles
              key={bairro.codigoBairro}
              name={bairro.nome}
              code={
                bairro.codigoBairro ? bairro.codigoBairro.toString() : 'N/A'
              }
              description="Municipio"
              data={
                bairro.codigoMunicipio
                  ? bairro.codigoMunicipio.toString()
                  : 'N/A'
              }
              status={bairro.status}
            />
          ))
        ) : (
          <p></p>
        )}
      </div>

      <button className="refresh" onClick={handleFetchBairro}>
        <i className="fa-solid fa-arrows-rotate"></i>
      </button>

      <div className="form-container">
        <div className="form">
          <label>
            <b>Código</b>
          </label>
          <input
            type="text"
            name="codigo"
            value={form.codigoBairro ? form.codigoBairro.toString() : ''}
            onChange={handleInputChange}
          />
          <label>
            <b>Código Municipio</b>
          </label>
          <input
            type="text"
            name="codigoMunicipio"
            value={form.codigoMunicipio ? form.codigoMunicipio.toString() : ''}
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
          <button onClick={handleConsultBairro}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <button onClick={handleCreateBairro}>
            <i className="fa-solid fa-plus"></i>
          </button>
          <button onClick={handleUpdateBairro}>
            <i className="fa-solid fa-pencil"></i>
          </button>
          <button onClick={handleDeleteBairro}>
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bairro;
