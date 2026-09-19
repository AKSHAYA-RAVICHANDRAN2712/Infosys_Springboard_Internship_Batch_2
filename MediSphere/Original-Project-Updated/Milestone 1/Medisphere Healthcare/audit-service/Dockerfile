FROM eclipse-temurin:25-jdk
WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests
EXPOSE 8082
CMD ["java", "-jar", "target/audit-service-0.0.1-SNAPSHOT.jar"]
