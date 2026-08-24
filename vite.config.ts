import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
    // proxy: {
    //   '/api/admin': {
    //     target: 'http://personaltrainerkmm.com/api/admin',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api\/admin/, ''), // Remove the '/api' prefix for the proxy request
    //     configure: (proxy, _options) => {
    //       proxy.on('error', (err, _req, _res) => {
    //         console.log('proxy error', err);
    //       });            proxy.on('proxyReq', (proxyReq, req, _res) => {
    //         console.log('Sending Request to the Target:', req.method, req.url);
    //       });            proxy.on('proxyRes', (proxyRes, req, _res) => {
    //         console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
    //       });
    //     },
    //   },
    // },
  //  headers : {
  //    "Access-Control-Allow-Origin": "*"
  //  }
  },
  build: {
    outDir: "build",
    // 🔴 [٢٥ أغسطس ٢٠٢٦] لا تُفرَّغ `build/` عند البناء.
    //
    // الافتراضيّ يحذف الأصول القديمة **ثم** يكتب الجديدة، ونشرُنا يكتب فوق
    // الدليل الذي يخدمه nginx مباشرةً ⇒ نافذةُ ثوانٍ تكون فيها الحزمة التي
    // يشير إليها `index.html` **المخبَّأ في متصفّح المدرّب** غير موجودة.
    //
    // وليست نظرية: في نشر ٠٠:٢٤ من هذا اليوم ردّ الخادم **500 على
    // `index-0b3d890e.js` و`index-a60696a2.css`** لعميلٍ حقيقيّ كانت شاشة
    // `/users` مفتوحةً أمامه، وعاد بعد ١١ ثانية بإعادة تحميل.
    //
    // وإبقاءُ القديم مقصودٌ أصلاً (كنّا نعيده يدوياً بـ`cp -n` بعد كل بناء)،
    // فالإعداد يجعله **بالبناء لا بخطوةٍ تُنسى** ويُغلق النافذة كلَّها.
    emptyOutDir: false
  },
  plugins: [tsconfigPaths(), react()],
});
