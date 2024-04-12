import { NextFunction, Request, Response } from 'express';
import jwtUtil from '../utils/jwt.util';
import SequelizeUser from '../database/models/SequelizeUser';

export default async function verifyTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token not found' });
  }
  try {
    const token = authorization.split(' ')[1];
    const payload = jwtUtil.verify(token);
    const user = await SequelizeUser.findByPk(payload.id);
    if (!user) throw new Error('User not found');
    req.body = { ...req.body, user: user.dataValues };
    next();
  } catch (e) {
    res.status(401).json({ message: 'Token must be a valid token' });
  }
}
