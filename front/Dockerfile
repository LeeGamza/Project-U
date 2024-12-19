# 1단계: Next.js 빌드
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json 복사 및 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# .env 파일 복사
COPY .env .env

# Next.js 빌드
RUN npm run build

# 2단계: Nginx로 배포
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# Next.js 정적 파일 복사
COPY --from=builder /app/out /usr/share/nginx/html

# Nginx 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
