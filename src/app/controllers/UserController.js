import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Fields validation fails.' });
    }

    const usersExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (usersExists) {
      return res.status(401).json({ error: 'This e-mail is already in use.' });
    }

    const { id, name, email } = await User.create(req.body);
    return res.status(201).json({
      message: 'User successfully created',
      id,
      name,
      email,
    });
  }
}

export default new UserController();
