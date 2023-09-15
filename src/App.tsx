import { useEffect, useState } from 'react';
import './App.css';
import axios, { AxiosResponse } from 'axios';

type Character = {
  id: number;
  name: string;
  image: string;
};

const firstPage = 1;
const lastPage = 42;

function App() {
  const [page, setPage] = useState<null | number>(null);
  const [chars, setChars] = useState<Character[] | null>(null);

  const fetchChars = async () => {
    if (page) {
      const response: AxiosResponse<{ results: Character[] }> = await axios.get(
        `https://rickandmortyapi.com/api/character/?page=${page}`,
        { params: { name: '' } }
      );
      const charToRender = response?.data?.results ?? [];
      setChars(charToRender);
    }
  };

  useEffect(() => {
    fetchChars();
  }, [page]);

  return (
    <div className="App">
      <header>
        <div>{!page ? 'Pick a Page' : `At Page ${page}`}</div>
        <input
          value={page ? page : ''}
          type={'range'}
          min={firstPage}
          max={lastPage}
          step={1}
          style={{ width: '600px' }}
          onChange={(event) => setPage(Number(event.target.value))}
        />
      </header>
      <main className={'card-wrapper'}>
        {chars &&
          chars.map((char) => (
            <div className="card" key={char.id}>
              <img src={char.image} alt="Avatar" style={{ width: '100%' }} />
              <div className="container">
                <h4>
                  <b>{char.name}</b>
                </h4>
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}

export default App;
