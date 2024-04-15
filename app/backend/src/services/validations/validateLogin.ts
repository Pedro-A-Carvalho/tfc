import * as Joi from 'joi';
import { SimpleServiceResponse } from '../../types/ServiceResponse';

const validateLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

type loginData = {
  email: string;
  password: string;
};

function validateLogin(data: loginData): SimpleServiceResponse | undefined {
  const { error } = validateLoginSchema.validate(data);
  if (error) {
    return { status: 401, data: { message: 'Invalid email or password' } };
  }
}

export default validateLogin;
