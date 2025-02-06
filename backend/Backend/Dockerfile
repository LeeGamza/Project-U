# 빌드 환경 설정 (Gradle 사용)
FROM bellsoft/liberica-openjdk-alpine:17 AS builder
WORKDIR /app

# Gradle Wrapper 및 소스 코드 복사
COPY . .
RUN chmod +x gradlew && ./gradlew clean build -x test

# 실행 환경 설정 (JAR 파일 실행)
FROM bellsoft/liberica-openjdk-alpine:17
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

# 포트 노출 및 실행
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
