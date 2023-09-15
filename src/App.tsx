import { useEffect, useState, useRef, KeyboardEvent } from 'react';
import type { ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import './App.css';

type Character = {
  id: number;
  name: string;
  image: string;
};

type ApiResponse = { results: Character[]; info: { pages: number } };
type ApiErrorResponse = { error: string };

const firstPage = 1;
const lastPage = 42;

//intro - show api
//https://rickandmortyapi.com/documentation/#get-all-characters

//Make a card component
//make it responsive

//next and previous button for page select

//improvements
//make prettier
//the fetching with try catch
//loader
//error handling

//extra implement a searchbar;

function App() {
  const [page, setPage] = useState<number | null>(null);
  const [chars, setChars] = useState<Character[]>([]);
  const [error, setError] = useState('');

  const search_term = useRef('');
  const startPage = useRef(1);
  const endPage = useRef(42);

  const fetchChars = async () => {
    try {
      if (page) {
        const response: AxiosResponse<ApiResponse> = await axios.get(
          `https://rickandmortyapi.com/api/character/?page=${page}`,
          { params: { name: search_term.current } }
        );

        endPage.current = response.data.info.pages;
        const charToRender = response?.data?.results ?? [];
        setError('');
        setChars(charToRender);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      if (axiosError.response) {
        setError(`${axiosError.response.data.error} for search "${search_term.current}"`);
        search_term.current = '';
      } else {
        setError(axiosError.message);
      }
    }
  };

  useEffect(() => {
    fetchChars();
  }, [page]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    setPage(1);
    if (event.key === 'Enter') {
      fetchChars();
    }
  };

  return (
    <div className="App">
      <header>
        <div>num of pages {endPage.current}</div>
        <div style={{ color: 'red' }}>{error}</div>
        <div>{!page ? 'Pick a Page' : `At Page ${page}`}</div>
        <input
          value={page ? page : ''}
          type={'range'}
          min={startPage.current}
          max={endPage.current}
          step={1}
          style={{ width: '600px' }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setPage(Number(event.target.value))}
        />
        <input
          type={'text'}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            (search_term.current = event.target.value)
          }
          onKeyDown={handleKeyDown}
        />
      </header>
      <main className={'card-wrapper'}>
        {chars.map((char) => (
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
