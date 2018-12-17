const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../app');
  });
  afterEach(async () => {
    await Genre.remove({});
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      let genre = new Genre({
        name: 'genre1'
      });
      genre = await genre.save();
      let genre2 = new Genre({
        name: 'genre2'
      });
      genre2 = await genre2.save();

      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a genre if a valid id is passed', async () => {
      let genre = new Genre({
        name: 'Horror'
      });
      genre = await genre.save();

      const res = await request(server).get('/api/genres/'+genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    });

    it('should return a 404 if invalid id is passed', async () => {
      let genre = new Genre({
        name: 'Horror'
      });
      genre = await genre.save();

      const res = await request(server).get(
        `/api/genres/${new mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let token;
    let name;

    const exec = async () => {
      const genre = { name };
      if (!token) {
        token = '';
      } else {
        token = `Bearer ${token}`;
      }
      return await request(server)
        .post('/api/genres')
        .set('Authorization', `${token}`)
        .send(genre);
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'Sci-fi';
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return an object that was created on bd', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', name);
    });

    it('should return 400', async () => {
      name = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      let genre = new Genre({
        name: 'Horror'
      });
      genre = await genre.save();
      const res = await request(server)
        .put(`/api/genres/${genre._id}`)
        .send({ name: 'Sci-fi' });
      expect(res.status).toBe(401);
    });

    it('should return the updated object', async () => {
      const token = new User().generateAuthToken();
      let genre = new Genre({
        name: 'Horror'
      });
      genre = await genre.save();

      const res = await request(server)
        .put(`/api/genres/${genre._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Sci-fi' });
      expect(res.status).toBe(200);
      expect(res.body).not.toHaveProperty('name', genre.name);
    });

    it('should return a 404 status', async () => {
      const token = new User().generateAuthToken();
      let genre = new Genre({
        name: 'Horror'
      });
      genre = await genre.save();

      const res = await request(server)
        .put(`/api/genres/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Sci-fi' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      let genre = new Genre({
        name: 'Horror'
      });
      genre = await genre.save();

      const res = await request(server)
        .delete(`/api/genres/${genre._id}`)
        .send({ name: 'Sci-fi' });
      expect(res.status).toBe(401);
    });

    it('should return 403 if client is not admin', async () => {
      const token = new User().generateAuthToken();
      let genre = new Genre({
        name: 'Horror'
      });
      genre = await genre.save();

      const res = await request(server)
        .delete(`/api/genres/${genre._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(403);
    });

    it('should return the deleted object', async () => {
      const token = new User({ isAdmin: true }).generateAuthToken();
      let genre = new Genre({
        name: 'Horror'
      });
      genre = await genre.save();
      console.log(genre._id);

      const res = await request(server)
        .delete(`/api/genres/${genre._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('name', genre.name);
    });
    it('should retun a 404 status', async () => {
      const token = new User({ isAdmin: true }).generateAuthToken();
      let genre = new Genre({
        name: 'Horror'
      });
      genre = await genre.save();

      const res = await request(server)
        .delete(`/api/genres/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });
});
