# AgriVil Mobile Engineering Guidelines

> **Target**: Mobile Web, PWA, and Android Capacitor WebView (`com.agrivil.marketplace`).

---

## 1. Native Android Hardware Back Button

In hybrid Capacitor apps, the default Android hardware back button can prematurely exit the application. AgriVil solves this via a two-layer delegation:

### Layer 1: Native Android Activity (`MainActivity.java`)
```java
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(AppUpdaterPlugin.class);
    }

    @Override
    public void onBackPressed() {
        if (this.bridge != null && this.bridge.getWebView() != null && this.bridge.getWebView().canGoBack()) {
            this.bridge.getWebView().goBack();
        } else {
            super.onBackPressed();
        }
    }
}
```

### Layer 2: Client-Side Listener (`MobileBackListener.tsx`)
- Intercepts back navigation to dismiss open modals/drawers first (e.g. Reviews Modal, Quick View, Image Lightbox) before popping browser history.

---

## 2. Touch Latency & Performance

- **Touch Action**: Global `touch-action: manipulation` prevents 300ms tap delay on mobile WebViews.
- **Link Prefetching**: All bottom navigation and category chip links use `prefetch={true}` for instant route transitions.
- **Image Optimization**: Produce images use Next.js `<Image />` with `sizes="(max-width: 640px) 190px, 240px"` and explicit `aspect-ratio` wrappers to eliminate layout shift (CLS).

---

## 3. Safe Area Inset Management

All sticky headers and floating bottom action bars must include safe area fallback styling:
```tsx
// Sticky Top Headers
style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}

// Sticky Bottom Action Bars & Navigation
style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' }}
```

---

## 4. Zero-Scrollbar Enforcement

To ensure an app-like experience without browser scrollbars appearing during swiping:
```css
* {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}
*::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
```
