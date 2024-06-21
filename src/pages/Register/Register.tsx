import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface FormData {
  email: string;
  password: string;
  username: string;
  name: string;
  last_name: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    username: '',
    name: '',
    last_name: '',
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('je');
    console.log(import.meta.env.VITE_API_URL);
    setError('');
    setSuccess('');

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}auth/register`,
        formData
      );
      setSuccess('Registro exitoso');
    } catch (error) {
      setError('Error en el registro');
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Emailllllll:</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type='text'
            name='username'
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nombre:</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type='text'
            name='last_name'
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <button type='submit'>Registrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </main>
  );
};

export default Register;
