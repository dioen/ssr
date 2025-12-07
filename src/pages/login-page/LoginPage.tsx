import { LoginForm } from '../../components/login-form/LoginForm';

// TODO: try to use server components?

const LoginPage = () => {
  return (
    <div className="h-full min-h-full flex items-center justify-center">
      {/* React 19 can hoist head tags 
            TODO: change to Helmet or check if native react meta hoisting works on SSR */}
      <title>Login Page</title>
      <meta name="description" content="Login to access your account" />

      <LoginForm />
    </div>
  );
};

export default LoginPage;
