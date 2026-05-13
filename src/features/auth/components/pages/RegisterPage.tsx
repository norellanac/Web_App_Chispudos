import React from 'react';
import Signup from './../organisms/Signup';
import AuthLayout from '../templates/AuthLayout';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout>
      <Signup />
    </AuthLayout>
  );
};

export default RegisterPage;
