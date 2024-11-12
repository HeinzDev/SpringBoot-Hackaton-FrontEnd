import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:8080/uf/all';

// Definindo a interface UF para refletir a estrutura correta
interface UF {
  codigoUF: number;
  sigla: string;
  nome: string;
  status: number;
}

export const getUFs = async (): Promise<UF[]> => {
  try {
    const response: AxiosResponse<UF[]> = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar UFs:', error);
    return [];
  }
};

export const addUF = async (uf: UF): Promise<UF | undefined> => {
  try {
    const response: AxiosResponse<UF> = await axios.post(API_URL, uf);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar UF:', error);
  }
};

export const updateUF = async (
  codigoUF: number,
  uf: UF
): Promise<UF | undefined> => {
  try {
    const response: AxiosResponse<UF> = await axios.put(
      `${API_URL}/${codigoUF}`,
      uf
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar UF:', error);
  }
};

export const deleteUF = async (codigoUF: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${codigoUF}`);
  } catch (error) {
    console.error('Erro ao deletar UF:', error);
  }
};
