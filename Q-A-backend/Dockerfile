# Bắt đầu từ image Node.js chính thức
FROM node:22

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và cài đặt các phụ thuộc
COPY package*.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng ứng dụng
EXPOSE 3009

# Lệnh chạy ứng dụng khi container khởi động
CMD ["npm", "run", "start"]