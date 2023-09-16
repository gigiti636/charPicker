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

//const firstPage = 1;
//const lastPage = 42;

//intro - show api
//https://rickandmortyapi.com/documentation/#get-all-characters

//Make a card component
//make it responsive

//next and previous button for page select

//find a way to make it more bug safe the slider maybe abort previous request

//improvements
//make prettier
//the fetching with try catch
//loader
//error handling

//extra implement a searchbar;

function App() {
  const [page, setPage] = useState<number>(1);
  const [chars, setChars] = useState<Character[]>([]);
  const [error, setError] = useState('');

  const search_term = useRef('');
  const startPage = useRef(1);
  const endPage = useRef(42);

  let cancelController = useRef<AbortController | null>(null);
  const fetchChars = async () => {
    try {
      if (cancelController.current) {
        cancelController.current.abort();
      }

      cancelController.current = new AbortController();
      const { signal } = cancelController.current;
      if (page) {
        const response: AxiosResponse<ApiResponse> = await axios.get(
          `https://rickandmortyapi.com/api/character/?page=${page}`,
          {
            params: { name: search_term.current },
            headers: {
              'Cache-Control': 'max-age=3600',
            },
            signal,
          }
        );

        cancelController.current = null;

        endPage.current = response.data.info.pages;
        const charToRender = response?.data?.results ?? [];
        setError('');
        setChars(charToRender);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;

        if (axiosError.response) {
          setError(`${axiosError.response.data.error} for search "${search_term.current}"`);
          search_term.current = '';
        } else {
          setError(axiosError.message);
        }
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

  const handlePrev = () => {
    if (page) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page) {
      setPage(page + 1);
    }
  };

  return (
    <div className="App">
      <header>
        <div style={{ color: 'red' }}>{error}</div>
        <div className={'btn-wrapper'}>
          {page && (
            <button
              className={'act-btn'}
              onClick={handlePrev}
              disabled={page === startPage.current}
            >
              Prev
            </button>
          )}
          <span style={{ marginLeft: '10px', marginRight: '10px' }}>
            {page} of {endPage.current}
          </span>
          {page && (
            <button className={'act-btn'} onClick={handleNext} disabled={page === endPage.current}>
              Next
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
          <input
            value={page ? page : ''}
            type={'range'}
            min={startPage.current}
            max={endPage.current}
            step={1}
            style={{ width: '600px' }}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setPage(Number(event.target.value))}
          />
          <div>
            <input
              style={{ opacity: search_term.current === '' ? 0.8 : 1, marginLeft: '10px' }}
              type={'text'}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                (search_term.current = event.target.value)
              }
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={() => {
                setPage(1);
                fetchChars();
              }}
            >
              Go
            </button>
          </div>
        </div>
      </header>
      <main className={'card-wrapper'}>
        {chars.map((char) => (
          <div className="card" key={char.id}>
            <img src={char.image} alt="Avatar" style={{ width: '100%' }} />
            <div className="container">
              <div>
                <b>{char.name}</b>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
