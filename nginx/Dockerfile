FROM node:alpine as build-stage
WORKDIR /code
COPY /src /code
RUN npm install
RUN npm run build

# 프로덕션 스테이지: Nginx 설정 및 SSL 인증서 생성
FROM nginx:alpine as production-stage

# 빌드 스테이지에서 정적 파일 복사
COPY --from=build-stage /code/out /usr/share/nginx/html

RUN apk update && \
    apk add --no-cache openssl

COPY ./conf /etc/nginx/conf.d
# Nginx 포트 노출
EXPOSE 443

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
