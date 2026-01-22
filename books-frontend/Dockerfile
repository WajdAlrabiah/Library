# المرحلة الأولى: بناء التطبيق
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# المرحلة الثانية: تشغيل التطبيق باستخدام Nginx
FROM nginx:alpine
# تأكدي من مسار dist الصحيح (اسم مشروعك غالباً يظهر هنا)
COPY --from=build /app/dist/books-frontend/browser /usr/share/nginx/html
EXPOSE 80