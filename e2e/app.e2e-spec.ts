import { TryOutUPage } from './app.po';

describe('try-out-u App', function() {
  let page: TryOutUPage;

  beforeEach(() => {
    page = new TryOutUPage();
  });

  it('should display message saying Welcome!', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome!');
  });
});
