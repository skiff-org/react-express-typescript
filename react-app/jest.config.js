/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
export default {
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
};