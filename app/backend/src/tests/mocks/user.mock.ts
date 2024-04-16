import SequelizeUser from "../../database/models/SequelizeUser";
import * as bcrypt from 'bcryptjs';

export const user = {
    email: 'admin@admin.com',
    password: 'secret_admin',
}

export const userFromDB = SequelizeUser.build({
id: 1,
email: user.email,
password: bcrypt.hashSync(user.password, 10),
username: 'admin',
role: 'admin',
});