import { handleRequest, sendEmail } from './server';
import express from 'express';

const sanitizer = require('string-sanitizer');

class MockEmailProvider {
    setApiKey: any;

    constructor() {
        this.send = this.send.bind(this);
        this.setApiKey = jest.fn();
    }

    send(msg: any) {
        return new Promise((resolve, reject) => {
            process.nextTick(() => sanitizer.validate.isEmail(msg.to) ?
                resolve([{ 'statusCode': 200, 'headers': '' }]) :
                reject({ 'response': { 'body': { 'errors': [{ 'message': 'Error' }] } } })
            );
        })
    }
}

function getMockReq(emailAddress: string) {
    return { 'body': { 'emailAddress': emailAddress } };
}

function getMockRes() {
    return { 'send': jest.fn(), 'status': jest.fn() };
}

test('sendEmail receives response', async () => {
    var mockEmailProvider = new MockEmailProvider;
    var res = getMockRes() as any as express.Response;
    sendEmail('testEmail@test.com', mockEmailProvider, res);
    var statusMock = res.status as any as jest.Mock;
    var sendMock = res.send as any as jest.Mock;

    // Status and send should have 1 call each
    const flushPromises = () => new Promise(setImmediate);
    await flushPromises();
    expect(statusMock.mock.calls.length).toBe(1);
    expect(statusMock.mock.calls[0][0]).toBe(200);
    expect(sendMock.mock.calls.length).toBe(1);
});

test('handleRequest accepts valid email address', async () => {
    var mockEmailProvider = new MockEmailProvider;
    var req = getMockReq('validEmailAddress@test.com') as any as express.Request;
    var res = getMockRes() as any as express.Response;
    handleRequest(req, res, mockEmailProvider);
    var statusMock = res.status as any as jest.Mock;
    var sendMock = res.send as any as jest.Mock;

    // Status and send should have 1 call each
    const flushPromises = () => new Promise(setImmediate);
    await flushPromises();
    expect(statusMock.mock.calls.length).toBe(1);
    expect(statusMock.mock.calls[0][0]).toBe(200);
    expect(sendMock.mock.calls.length).toBe(1);
});

test('handleRequest rejects invalid email address', async () => {
    var mockEmailProvider = new MockEmailProvider;
    var req = getMockReq('invalidEmailAddress') as any as express.Request;
    var res = getMockRes() as any as express.Response;
    handleRequest(req, res, mockEmailProvider);
    var statusMock = res.status as any as jest.Mock;
    var sendMock = res.send as any as jest.Mock;

    // Status and send should have 1 call each
    const flushPromises = () => new Promise(setImmediate);
    await flushPromises();
    expect(statusMock.mock.calls.length).toBe(1);
    expect(statusMock.mock.calls[0][0]).toBe(403);
    expect(sendMock.mock.calls.length).toBe(1);
});
