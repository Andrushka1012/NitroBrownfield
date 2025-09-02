describe('Example', () => {
  beforeAll(async () => {
    console.log('qwe beforeAll');
    await device.launchApp();
    console.log('qwe afterAll');
  });

  beforeEach(async () => {
    console.log('qwe beforeEach');
    await device.reloadReactNative();
    console.log('qwe afterEach');
  });

  it('should have welcome screen', async () => {
    console.log('qwe it');
    // await expect(element(by.id('welcome'))).toBeVisible();
    await expect(element(by.text('See Your Changes'))).toBeVisible();
    console.log('qwe it after');
  });

});
