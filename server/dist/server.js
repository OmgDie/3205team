'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express_1.default.json());
app.get('/search', (req, res) => {
  setTimeout(() => {
    const { email } = req.body;
    const parsedEmail = email.split('@')[0].toLowerCase();
    const rawData = fs.readFileSync('../data/users.json', 'utf-8');
    const usersData = JSON.parse(rawData).users;
    const foundUsers = usersData.filter(user => {
      const userEmail = user.email.split('@')[0].toLowerCase();
      return userEmail === parsedEmail;
    });
    if (foundUsers.length > 0) {
      res.json(foundUsers);
    } else {
      res.json({ message: 'Нет совпадений' });
    }
  }, 5000);
});
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
//# sourceMappingURL=server.js.map
