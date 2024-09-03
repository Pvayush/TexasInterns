import { useState, useEffect } from 'react';
import { Logo, FormRow } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

function Register() {
  const [values, setValues] = useState(initialState);
  const { user, isLoading } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      toast.error('Please fill out all fields');
      return;
    }
    if (isMember) {
      dispatch(loginUser({ email: email, password: password }));
      return;
    }
    dispatch(registerUser({ name, email, password }));
  };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

// Register.js
const handleDemoUser = () => {
  const demoUser = {
    name: 'Demo User',
    email: 'demoUser@test.com',
    password: 'demopassword',
  };

  // Save demo user to localStorage
  localStorage.setItem('user', JSON.stringify(demoUser));

  // Simulate setting user in Redux state and redirecting
  dispatch(loginUser(demoUser));  // Directly set demo user in Redux state
  toast.success('Logged in as Demo User');
  setTimeout(() => {
    navigate('/dashboard');  // Redirect to the dashboard after login
  }, 1000);
};


  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/dashboard');  // Redirect to the dashboard after login
      }, 2000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <h3>{values.isMember ? 'Texas Interns Register' : 'Texas Interns Login'}</h3>
        {!values.isMember && (
          <FormRow
            type='text'
            name='name'
            value={values.name}
            handleChange={handleChange}
          />
        )}
        <FormRow
          type='email'
          name='email'
          value={values.email}
          handleChange={handleChange}
        />
        <FormRow
          type='password'
          name='password'
          value={values.password}
          handleChange={handleChange}
        />
        <button type='submit' className='btn btn-block' disabled={isLoading}>
          {isLoading ? 'loading...' : 'submit'}
        </button>
        <button
          type='button'
          className='btn btn-block btn-hipster'
          disabled={isLoading}
          onClick={handleDemoUser}  // Updated for demo user
        >
          {isLoading ? 'loading...' : 'demo app'}
        </button>
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}
          <button type='button' onClick={toggleMember} className='member-btn'>
            {values.isMember ? ' Register' : ' Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  );
}

export default Register;
