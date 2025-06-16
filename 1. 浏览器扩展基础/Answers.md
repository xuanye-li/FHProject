# 📘 1.1 Getting to Know Browser Extensions

A **browser extension** changes how the browser behaves, looks, or interacts with websites — like an **app for your browser**.

## 🧱 Folder Structure Example

```
my-extension/
├── manifest.json          # 🧭 Extension configuration
├── background.js          # ⚙️ Background script (service worker)
├── content.js             # 📄 Injected into web pages (DOM manipulation)
├── popup.html             # 🖼 UI shown when clicking the extension icon
├── popup.js               # 🎮 Logic for the popup UI
├── styles.css             # 🎨 Styles for popup or injected scripts
├── icon.png               # 🖼 Toolbar or store icon
└── assets/                # 📁 Optional images, fonts, etc.
```

## 📄 `manifest.json` – Extension Configuration

Defines:

* What the extension is
* What it does
* What permissions it needs
* Which files/scripts it uses

```json
{
  "manifest_version": 3,
  "name": "My First Extension",
  "version": "1.0",
  "description": "Changes the background color of a webpage.",
  "permissions": ["scripting", "tabs"],
  "host_permissions": ["<all_urls>"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  "icons": {
    "48": "icon.png"
  }
}
```

---

# 🚀 1.2 Capabilities of Browser Extensions

## 🔧 Chrome API Summary

* `chrome.accessibilityFeatures` – Manage Chrome's accessibility features (e.g. font scaling, captions)
* `chrome.action` – Control the toolbar icon (badge, popup, title)
* `chrome.alarms` – Schedule background tasks periodically
* `chrome.bookmarks` – Create and manage bookmarks
* `chrome.browsingData` – Clear browsing history, cache, cookies
* `chrome.commands` – Define keyboard shortcuts
* `chrome.contentSettings` – Control site-level permissions (e.g. cookies, JavaScript)
* `chrome.contextMenus` – Add entries to the right-click menu
* `chrome.cookies` – Read, write, and monitor cookies
* `chrome.debugger` – Use DevTools Protocol with tabs
* `chrome.declarativeContent` – React to page content without direct script injection
* `chrome.desktopCapture` – Capture screen, window, or tab
* `chrome.dom` – Perform privileged DOM operations
* `chrome.downloads` – Programmatically manage downloads
* `chrome.events` – Standard extension event APIs
* `chrome.extension` – Messaging and view management tools
* `chrome.extensionTypes` – Shared type definitions
* `chrome.fontSettings` – Customize default browser fonts
* `chrome.gcm` – Integrate with Firebase Cloud Messaging
* `chrome.history` – Access and manipulate browser history
* `chrome.i18n` – Enable localization and translation
* `chrome.identity` – OAuth2 and user identity
* `chrome.idle` – Detect when user/system is idle
* `chrome.instanceID` – Unique ID for extension instance
* `chrome.management` – Manage other extensions/apps
* `chrome.notifications` – Show system-level notifications
* `chrome.offscreen` – Use hidden offscreen documents (e.g., for rendering)
* `chrome.runtime` – Extension lifecycle and messaging
* `chrome.permissions` – Request/check permissions at runtime
* `chrome.scripting` – Dynamically inject scripts/styles
* `chrome.sidePanel` – Add a persistent browser side panel
* `chrome.storage` – Store and sync extension data
* `chrome.tabs` – Create, update, and query tabs
* `chrome.userScripts` – Manage user-defined scripts
* `chrome.webNavigation` – Observe navigation events
* `chrome.webRequest` – Inspect or modify network requests
* `chrome.windows` – Control and manipulate browser windows

---

# 🌍 1.3 Real-World Use Cases

| Category                | Example Extensions                              |
| ----------------------- | ----------------------------------------------- |
| **Ad Blocking**         | uBlock Origin, Adblock Plus                     |
| **Password Management** | Bitwarden, LastPass, 1Password                  |
| **Security & Privacy**  | HTTPS Everywhere, DuckDuckGo Privacy Essentials |
| **Productivity**        | Notion Web Clipper, Todoist, Momentum           |
| **Developer Tools**     | React DevTools, JSON Viewer, Wappalyzer         |
| **Translation**         | Google Translate, DeepL                         |
| **Shopping**            | Honey, Rakuten                                  |
| **Custom Styling**      | Stylus, Dark Reader                             |
| **Automation**          | iMacros, Bardeen                                |
| **Bookmark & Tab Mgmt** | OneTab, Tab Manager Plus                        |
