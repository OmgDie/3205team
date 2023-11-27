const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

interface IUser {
  email: string;
  number: string;
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.get('/search', (req, res) => {
  setTimeout(() => {
    const email = Array.isArray(req.query.email)
      ? req.query.email[0]
      : req.query.email;

    if (typeof email === 'string') {
      const parsedEmail = email.split('@')[0].toLowerCase();

      try {
        const rawData = fs.readFileSync('./data/users.json', 'utf-8');
        const usersData: IUser[] = JSON.parse(rawData).users;

        const foundUsers = usersData.filter((user: IUser) => {
          const userEmail = user.email.split('@')[0].toLowerCase();
          return userEmail === parsedEmail;
        });

        if (foundUsers.length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.json(foundUsers);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.json({ message: 'Нет совпадений' });
        }
      } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
      }
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json({ message: 'Некорректный email' });
    }
  }, 5000);
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
