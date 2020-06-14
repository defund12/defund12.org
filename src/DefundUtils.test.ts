import {DefundUtils} from './DefundUtils';

describe('Defund 12 Static Utilities', function() {
  describe('markdownToHTML', function() {
    it('Should transform markdown elements to HTML elements.', () => {
      const link = DefundUtils.markdownToHTML('[Defund 12.org](defund12.org)');
      expect(link).toEqual('<p><a href="defund12.org">Defund 12.org</a></p>');
    });

    it('Should prevent <script> tags.', () => {
      const renderedScriptTag = DefundUtils.markdownToHTML(
          '_Hi!_<script>window.location.href = superDangerousUrl</script>');
      expect(renderedScriptTag).toEqual(
          '<p><em>Hi!</em>window.location.href = superDangerousUrl</p>');
    });

    it('Should collect a message on errors and return no content.', () => {

    });
  });
});
