/* UpSkillSprint lesson resource downloads: reconstruct original bytes from static base64 assets. */
(() => {
'use strict';
  // Original binary training downloads are stored as base64 text assets to retain exact bytes.
  document.querySelectorAll('[data-binary-download]').forEach(link => {
    link.addEventListener('click', async (event) => {
      event.preventDefault();
      const original = link.textContent;
      link.textContent = 'Preparing download…';
      try {
        const response = await fetch(link.href);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const encoded = (await response.text()).replace(/\s+/g, '');
        const decoded = atob(encoded);
        const bytes = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
        const url = URL.createObjectURL(new Blob([bytes], {type: link.dataset.mime || 'application/octet-stream'}));
        const download = document.createElement('a');
        download.href = url;
        download.download = link.dataset.binaryDownload;
        document.body.append(download);
        download.click();
        download.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (error) {
        alert('Download unavailable. Please reload the lesson and try again.');
      } finally {
        link.textContent = original;
      }
    });
  });
})();
