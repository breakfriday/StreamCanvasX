
export default function createTextInput(textNode, areaPosition) {
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);

  textarea.value = textNode.text();
  textarea.style.position = 'absolute';
  textarea.style.top = `${areaPosition.y}px`;
  textarea.style.left = `${areaPosition.x}px`;
  textarea.style.width = textNode.width();

  textarea.focus();

  textarea.addEventListener('keydown', (e) => {
    // hide on enter
    if (e.keyCode === 13) {
      textNode.text(textarea.value);
      document.body.removeChild(textarea);
    }
  });
}
