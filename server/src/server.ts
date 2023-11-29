import express, { Request, Response } from 'express';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(express.json());

interface IUser {
  email: string;
  number: string;
}

app.get('/search', (req: Request, res: Response) => {
  setTimeout(() => {
    const email = Array.isArray(req.query.email)
      ? req.query.email[0]
      : req.query.email;

    if (typeof email === 'string') {
      try {
        const rawData = fs.readFileSync('./data/users.json', 'utf-8');
        const usersData: IUser[] = JSON.parse(rawData).users;

        const foundUsers = usersData.filter((user: IUser) => {
          const userEmail = user.email.toLowerCase();
          return userEmail.startsWith(email.toLowerCase());
        });

        if (foundUsers.length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.json(foundUsers);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.json({ message: 'Нет совпадений' });
        }
      } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
      }
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json({ message: 'Некорректный email' });
    }
  }, 5000);
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
