import * as bcrypt from 'bcryptjs';
import { SimpleServiceResponse } from '../types/ServiceResponse';
import jwtUtil from '../utils/jwt.util';
import { LoginData } from '../types/LoginData';
import SequelizeUser from '../database/models/SequelizeUser';
import validateLogin from './validations/validateLogin';

export default class UserService {
  private model: typeof SequelizeUser;

  constructor() {
    this.model = SequelizeUser;
  }

  public async login(data: LoginData): Promise<SimpleServiceResponse> {
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

  public async getRole(userId: number): Promise<SimpleServiceResponse> {
    const user = await this.model.findByPk(userId);
    return { status: 200, data: { role: user?.role || '' } };
  }
}
