import { Field, Form, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Form.scss';
import { Link } from 'react-router-dom';

interface IFormComponentParameters {
  title: string;
  buttonTitle: 'Create account' | 'Sign In';
  type: 'signup' | 'signin';
  onSubmitHandler: (username: string, password: string) => void;
  error: null | string;
}

const FormComponent: React.FunctionComponent<IFormComponentParameters> = ({
  title,
  buttonTitle,
  type,
  onSubmitHandler,
  error,
}: IFormComponentParameters) => {
  const link =
    type === 'signin' ? (
      <Link to="/signup">Create account</Link>
    ) : (
      <Link to="/login">Sign In</Link>
    );

  return (
    <div className="formWrapper">
      <div className="formMainDiv">
        <h2>{title}</h2>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={Yup.object({
            username: Yup.string().required('Username is required!'),
            password: Yup.string().required('Password is required!'),
          })}
          onSubmit={({ username, password }) => {
            onSubmitHandler(username, password);
          }}
        >
          <Form>
            <div className="fieldsWrapper">
              <label htmlFor="username">Username</label>
              <Field
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
              />
              <label htmlFor="password">Password</label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
              />
              <button type="submit" className="button">
                {buttonTitle}
              </button>
              <p>Or you can {link}</p>
              <ErrorMessage
                component="div"
                className="fieldError"
                name="username"
              />
              <ErrorMessage
                component="div"
                className="fieldError"
                name="password"
              />
              {error ? <div className="fieldError">{error}</div> : null}
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default FormComponent;
