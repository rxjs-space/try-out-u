import { TryOutUPage } from './app.po';

describe('try-out-u App', function() {
  let page: TryOutUPage;

  beforeEach(() => {
    page = new TryOutUPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
