import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll();

    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .max(100)
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Fields validation invalid.' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });
    if (studentExists) {
      return res.status(401).json({
        error: 'This e-mail is already in use.',
        data: {
          name: studentExists.name,
          email: studentExists.email,
          created_at: studentExists.createdAt,
        },
      });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );
    return res.status(201).json({
      message: 'Student succesfully created',
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentController();
