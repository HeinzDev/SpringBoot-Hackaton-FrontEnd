import axios from 'axios';
import { useEffect, useState } from 'react';
import './Profile.css';

interface Endereco {
  codigoEndereco: number;
  nomeRua: string;
  numero: number;
}

interface ProfileProps {
  code: number;
  onClose: () => void; // Função para fechar o perfil
}

interface Usuario {
  codigoPessoa: number;
  nome: string;
  sobrenome: string;
  idade: number;
  login: string;
  senha: string;
  status: number;
  enderecos: Endereco[];
}

const Profile: React.FC<ProfileProps> = ({ code, onClose }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/pessoa?codigoPessoa=${code}`
        );
        setUser(response.data);
        setEnderecos(response.data.enderecos || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [code]);

  return (
    <div className="profile">
      <div className="content">
        {user && (
          <>
            <div className="profile-data">
              <img
                src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                alt="User"
              />
              <div className="user-data">
                <h2>
                  {user.nome} {user.sobrenome}
                </h2>
                <ul>
                  <li>Codigo: {user.codigoPessoa}</li>
                  <li>Idade: {user.idade}</li>
                  <li>Login: {user.login}</li>
                  <li>Senha: {user.senha}</li>
                  <li>Status: {user.status === 1 ? 'Ativo' : 'Desativado'}</li>
                </ul>
              </div>
            </div>

            <div className="enderecos">
              {enderecos.map((endereco) => (
                <div key={endereco.codigoEndereco} className="endereco-bubble">
                  <div className="house-icon">
                    <i className="fa-solid fa-house-circle-check"></i>
                  </div>
                  <div className="endereco-data">
                    <p>
                      <strong>Código do Endereço:</strong>{' '}
                      {endereco.codigoEndereco}
                    </p>
                    <p>
                      <strong>Rua:</strong> {endereco.nomeRua}
                    </p>
                    <p>
                      <strong>Número:</strong> {endereco.numero}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <button className="fa-solid fa-close" onClick={onClose}></button>
      </div>
    </div>
  );
};

export default Profile;
