import * as bcrypt from 'bcryptjs';
import jwtUtil from '../utils/jwt.util';
import { LoginData } from '../types/LoginData';
import SequelizeUser from '../database/models/SequelizeUser';
import validateLogin from './validations/validateLogin';

export default class UserService {
  private model: typeof SequelizeUser;

  constructor() {
    this.model = SequelizeUser;
  }

  public async login(data: LoginData) {
    if (!data.email || !data.password) {
      return { status: 400, data: { message: 'All fields must be filled' } };
    }
    const errors = validateLogin(data);
    if (errors) return errors;
    const user = await this.model.findOne({ where: { email: data.email } });
    if (!user || !bcrypt.compareSync(data.password, user.dataValues.password)) {
      return { status: 401, data: { message: 'Invalid email or password' } };
    }
    const { id, username } = user.dataValues;
    const token = jwtUtil.create({ id, username });
    return { status: 200, data: { token } };
  }
}
