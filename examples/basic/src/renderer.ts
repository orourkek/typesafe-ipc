import { ipcRenderer } from './ipc';
import './renderer.css';

document.addEventListener('DOMContentLoaded', () => {

  const button = document.getElementById('button');
  const counter = document.getElementById('counter');
  let count = 0;

  if (!button || !counter) {
    throw new Error('Requisite elements don\'t exist');
  }

  button.addEventListener('click', () => {
    count++;
    counter.innerHTML = count.toString();
    /**
     * The `send` call below will throw type errors if the passed payload
     * doesn't match the expected type.
     */
    ipcRenderer.send('button-click', { count });
  });

});
