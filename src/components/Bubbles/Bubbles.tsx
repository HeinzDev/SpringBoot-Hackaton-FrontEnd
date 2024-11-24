import { FC } from 'react';
import './Bubbles.css';

interface BubbleProps {
  name: string;
  code: string;
  description: string;
  data: string;
  status: number;
  onClick: () => void; // Adicionando a propriedade onClick
}

const Bubbles: FC<BubbleProps> = ({
  name,
  code,
  description,
  data,
  status,
  onClick,
}) => {
  const backgroundColorClass = status == 2 ? 'deactivated' : 'activated';

  return (
    <div className={backgroundColorClass} onClick={onClick}>
      <li>
        <ul id="name">
          <b>{name}</b>
        </ul>
        <ul>Código: {code}</ul>
        {data == '' ? (
          ''
        ) : (
          <ul>
            {description}: {data}
          </ul>
        )}
        <ul>status: {status}</ul>
      </li>
    </div>
  );
};

export default Bubbles;
