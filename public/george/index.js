"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */

const errorCode = document.getElementById("uv-error-code");

function runsearch(v) {
  const url = search(v, searchEngine.value);
  location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await registerSW();
  } catch (err) {
    error.textContent = "Failed to register service worker.";
    errorCode.textContent = err.toString();
    throw err;
  }

  runsearch(address.value)
});

window.addEventListener('load', async function() {
  
  try {
    await registerSW();
  } catch (err) {
    error.textContent = "Failed to register service worker.";
    errorCode.textContent = err.toString();
    throw err;
  }
  
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if ( urlParams.get('uul')) {
    const value = urlParams.get('uul')
    runsearch(value)
  }
});

