import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import './App.css';

const addMaskToNumber = number => {
  return number.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3');
};

const fetchDataFromServer = async email => {
  try {
    const response = await fetch(`http://localhost:3000/search?email=${email}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const useValidation = (value, validations) => {
  const [isEmpty, setEmpty] = useState(true);
  const [minLengthError, setMinLengthError] = useState(false);
  const [maxLengthError, setMaxLengthError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [inputVaild, setInputValid] = useState(false);
  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case 'minLength':
          value.length < validations[validation]
            ? setMinLengthError(true)
            : setMinLengthError(false);
          break;
        case 'isEmpty':
          value ? setEmpty(false) : setEmpty(true);
          break;
        case 'maxLength':
          value.length > validations[validation]
            ? setMaxLengthError(true)
            : setMaxLengthError(false);
          break;
        case 'isEmail':
          const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          re.test(String(value).toLowerCase())
            ? setEmailError(false)
            : setEmailError(true);
          break;
      }
    }
  }, [value]);

  useEffect(() => {
    if (isEmpty || maxLengthError || minLengthError || emailError) {
      setInputValid(false);
    } else {
      setInputValid(true);
    }
  }, [isEmpty, maxLengthError, minLengthError, emailError]);
  return {
    isEmpty,
    minLengthError,
    maxLengthError,
    emailError,
    inputVaild,
  };
};

const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setDirty] = useState(false);
  const valid = useValidation(value, validations);

  const onChange = e => {
    setValue(e.target.value);
  };

  const onBlur = e => {
    setDirty(true);
  };

  return {
    value,
    onBlur,
    onChange,
    isDirty,
    ...valid,
  };
};

const App = () => {
  const [dataFromServer, setDataFromServer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noMatches, setNoMatches] = useState(false);
  const email = useInput('', { isEmpty: true, minLength: 3, isEmail: true });
  const number = useInput('', { maxLenght: 6 });

  const handleFormSubmit = async () => {
    if (email.inputVaild) {
      setDataFromServer([]);
      setLoading(true);
      setNoMatches(false);

      try {
        const data = await fetchDataFromServer(email.value);
        setLoading(false);
        setDataFromServer(data);

        if (data.length === 0) {
          setNoMatches(true);
        }
      } catch (error) {
        console.error('Error handling form submit:', error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <div className="wrap">
        {email.isDirty && email.isEmpty && (
          <div style={{ color: 'red' }}>Поле не может быть пустым</div>
        )}
        {email.isDirty && email.minLengthError && (
          <div style={{ color: 'red' }}>Некорректная длина</div>
        )}
        {email.isDirty && email.emailError && (
          <div style={{ color: 'red' }}>Некорректный емейл</div>
        )}
        <input
          value={email.value}
          onChange={e => email.onChange(e)}
          onBlur={e => email.onBlur(e)}
          name="email"
          type="email"
          placeholder="Enter ur email"
          className="input"
          required
        ></input>
        {number.isDirty && number.maxLengthError && (
          <div style={{ color: 'red' }}>
            Максимальная длина номера 6 символов
          </div>
        )}
        <InputMask
          mask="99-99-99"
          maskChar="_"
          value={number.value}
          onChange={e => number.onChange(e)}
          onBlur={e => number.onBlur(e)}
          name="number"
          placeholder="Enter ur number"
          className="input"
        />
        <button
          disabled={!email.inputVaild}
          className="button"
          type="submit"
          onClick={() => handleFormSubmit()}
        >
          submit
        </button>
        {loading && <p>Loading...</p>}
        {Array.isArray(dataFromServer) && dataFromServer.length > 0 ? (
          <div>
            {dataFromServer.map(user => (
              <div key={user.email}>
                <p style={{ padding: '10px' }}>Email: {user.email}</p>
                <p style={{ padding: '10px' }}>
                  Number: {addMaskToNumber(user.number)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No matches found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
