const {
    Genre,
    validateGenre
} = require('../../../models/genre');

describe('validateGenre function', () => {
    it('should return a validated genre', () => {
        const definition = {
            name: 'Horror'
        };
        const genre = new Genre(definition);
        const res = validateGenre(genre);
        expect(res.value).toMatchObject(definition);
    });

    it('should return an object with an error', () => {
        const definition = {
            invalidPropery: 'Horror'
        };
        const genre = new Genre(definition);
        const res = validateGenre(genre);
        expect(res.error.message).toContain('name');
    });
});