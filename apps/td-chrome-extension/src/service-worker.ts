declare const chrome: any;

chrome.action.onClicked.addListener(async (tab: any) => {
  if (!tab?.id) return;

  await chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: () => {
      const IFRAME_ID = 'td-ui-iframe';
      const MSG_TYPE = 'TD_UI_DRAWER';

      const existing = document.getElementById(IFRAME_ID);
      if (existing) {
        // optional: cleanup listener if you store it somewhere; simplest is reload page removes it anyway
        existing.remove();
        return;
      }

      const iframe = document.createElement('iframe');
      iframe.id = IFRAME_ID;
      iframe.src = chrome.runtime.getURL('td-ui/index.html');

      // set a sensible default width (closed drawer)
      const setWidth = (payload: any) => {
        if (payload?.fullWidth === true) {
          iframe.style.width = '100vw';
          return;
        }
        if (typeof payload?.widthPx === 'number') {
          const px = Math.max(48, Math.min(payload.widthPx, window.innerWidth));
          iframe.style.width = `${px}px`;
        }
      };


      Object.assign(iframe.style, {
        position: 'fixed',
        top: '40px',
        left: '0',
        width: '48px',          // closed state width
        height: 'calc(100vh - 40px)',
        border: '0',
        zIndex: '2147483647',
        background: 'white',
        transition: 'width 180ms ease'
      });

      // Listen for messages coming from the iframe (Angular app)
      window.addEventListener('message', (event) => {
        // Basic filtering:
        // - only accept messages from our iframe
        if (event.source !== iframe.contentWindow) return;

        const data = event.data;
        if (!data || data.type !== MSG_TYPE) return;

        setWidth(data);

      });

      document.documentElement.appendChild(iframe);
    }
  });
});
