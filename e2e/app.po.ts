import { browser, element, by } from 'protractor';

export class TryOutUPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root app-platform-common h1')).getText();
  }
}
