import { GSTAppPage } from './app.po';

describe('gst-app App', () => {
  let page: GSTAppPage;

  beforeEach(() => {
    page = new GSTAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
