# Build stage
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy Maven configuration and wrapper
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Ensure mvnw is executable
RUN chmod +x mvnw

# Copy source code
COPY src ./src

# Build the application skipping tests
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy built JAR artifact from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
