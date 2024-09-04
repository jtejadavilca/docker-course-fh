const { syncDB } = require("../../tasks/sync-db");

describe('Pruebas en Sync-DB', () => {
    test('Debe de ejecutar el proceso dos veces', () => {
        syncDB();
        const times = syncDB();

        expect(times).toBe(2);
    });
});