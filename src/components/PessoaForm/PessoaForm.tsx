import axios from 'axios';
import { useState, ChangeEvent } from 'react';
import './PessoaForm.css';

interface Endereco {
  nomeRua: string;
  numero: string;
  complemento: string;
  cep: string;
  codigoBairro: number;
  codigoPessoa?: number;
}
interface PessoaProps {
  onClose: () => void; // Função para fechar o perfil
}

interface Pessoa {
  nome: string;
  sobrenome: string;
  idade: number;
  login: string;
  senha: string;
  status: number;
  enderecos: Endereco[];
}

const PessoaForm: React.FC<PessoaProps> = ({ onClose }) => {
  const [form, setForm] = useState<Pessoa>({
    nome: '',
    sobrenome: '',
    idade: 0,
    login: '',
    senha: '',
    status: 0,
    enderecos: [
      {
        nomeRua: '',
        numero: '',
        complemento: '',
        cep: '',
        codigoBairro: 0,
        codigoPessoa: 0,
      },
    ],
  });

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;
    setForm({
      ...form,
      status: checked ? parseInt(value) : 0,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEnderecoChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const newEnderecos = [...form.enderecos];
    newEnderecos[index] = { ...newEnderecos[index], [name]: value };
    setForm({ ...form, enderecos: newEnderecos });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pessoaResponse = await axios.post('http://localhost:8080/pessoa', {
        ...form,
        enderecos: form.enderecos,
      });
      console.log(pessoaResponse.data);
      alert('Pessoa criada com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };

  return (
    <div className="create-from-content">
      <form className="form-pessoa" onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleInputChange}
        />
        <label htmlFor="sobrenome">Sobrenome</label>
        <input
          type="text"
          name="sobrenome"
          value={form.sobrenome}
          onChange={handleInputChange}
        />
        <label htmlFor="idade">Idade</label>
        <input
          type="number"
          name="idade"
          value={form.idade.toString()}
          onChange={handleInputChange}
        />
        <label htmlFor="login">Login</label>
        <input
          type="text"
          name="login"
          value={form.login}
          onChange={handleInputChange}
        />
        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          name="senha"
          value={form.senha}
          onChange={handleInputChange}
        />
        <div className="status-container">
          <span>Status: </span>
          <label htmlFor="status1">1</label>
          <input
            id="status1"
            type="checkbox"
            name="status"
            value="1"
            checked={form.status === 1}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="status2">2</label>
          <input
            id="status2"
            type="checkbox"
            name="status"
            value="2"
            checked={form.status === 2}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className="form-pessoa-endereco">
          <label htmlFor="nomeRua">Nome da Rua</label>
          <input
            type="text"
            name="nomeRua"
            value={form.enderecos[0].nomeRua}
            onChange={(e) => handleEnderecoChange(e, 0)}
          />
          <label htmlFor="numero">Número</label>
          <input
            type="text"
            name="numero"
            value={form.enderecos[0].numero}
            onChange={(e) => handleEnderecoChange(e, 0)}
          />
          <label htmlFor="complemento">Complemento</label>
          <input
            type="text"
            name="complemento"
            value={form.enderecos[0].complemento}
            onChange={(e) => handleEnderecoChange(e, 0)}
          />
          <label htmlFor="cep">CEP</label>
          <input
            type="text"
            name="cep"
            value={form.enderecos[0].cep}
            onChange={(e) => handleEnderecoChange(e, 0)}
          />
          <label htmlFor="codigoBairro">Código do Bairro</label>
          <input
            type="number"
            name="codigoBairro"
            value={form.enderecos[0].codigoBairro.toString()}
            onChange={(e) => handleEnderecoChange(e, 0)}
          />
          <label htmlFor="codigoPessoa">Código da Pessoa</label>
          <input
            type="number"
            name="codigoPessoa"
            value={form.enderecos[0].codigoPessoa || ''}
            onChange={(e) => handleEnderecoChange(e, 0)}
          />
        </div>
        <button type="submit" className="submit-pessoa-button">
          Criar Usuário
        </button>
      </form>
      <button onClick={onClose} className="fechar-form-button">
        Fechar
      </button>
    </div>
  );
};

export default PessoaForm;
